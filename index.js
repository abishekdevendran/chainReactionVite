const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV === "production") {
  console.log("production");
  app.use(express.static(path.join(__dirname, "frontend/dist")));
}
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/dist/index.html"));
});

const io = new Server(httpServer, {
  /* options */
  cors: {
    origin: "*",
    transports: ["websocket", "polling"],
  },
});
console.log(`Server started on port ${PORT}`);

let rooms = [];
let colors = [
  "#66664D",
  "#991AFF",
  "#E666FF",
  "#4DB3FF",
  "#1AB399",
  "#E666B3",
  "#33991A",
  "#CC9999",
  "#B3B31A",
  "#00E680",
];

io.on("connection", (socket) => {
  socket.on("roomJoin", (roomCode, user, fn) => {
    socket.join(roomCode);
    console.log("joined room: " + roomCode);
    let room = rooms.find((r) => r.roomCode === roomCode);
    let id = room ? room.users.length + 1 : 1;
    let userObject = {
      id: id,
      uname: user.uname,
      color: colors[id],
      eliminated: room ? (room.hasStarted ? true : false) : false,
      count: 0,
      isReady: false,
      socketId: socket.id,
    };
    if (!room) {
      room = {
        roomCode: roomCode,
        users: [userObject],
        hasStarted: false,
        board: [],
        size: { m: 6, n: 6 },
      };
      rooms.push(room);
    } else {
      if (room.users?.find((u) => u.uname === user.uname)) {
        fn(false);
        return;
      }
      room.users.push(userObject);
    }
    socket.to(roomCode).emit("updatePlayers", room.users);
    fn(true, room.users, room.size, room.hasStarted);
    console.log(room.hasStarted);
  });
  socket.on("updateReady", (roomCode, user) => {
    let room = rooms.find((r) => r.roomCode === roomCode);
    let player = room.users.find((u) => u.uname === user.uname);
    player.isReady = !player.isReady;
    if (room.users.length >= 2 && room.users.every((u) => u.isReady)) {
      room.hasStarted=true;
      io.to(roomCode).emit("startGame", room.board);
    }
    io.to(roomCode).emit("updatePlayers", room.users);
  });

  socket.on("updateBoardSize", (roomCode, { m, n }) => {
    let room = rooms.find((r) => r.roomCode === roomCode);
    room.size = { m, n };
    io.to(roomCode).emit("updateBoardSize", room.size);
  });

  socket.on("readyReset", (roomCode) => {
    let room = rooms.find((r) => r.roomCode === roomCode);
    room.users?.forEach((u) => {
      u.isReady = false;
    });
    io.to(roomCode).emit("updatePlayers", room.users);
  });

  socket.on("updateSHasStarted", (roomCode, hasStarted) => {
    let room = rooms.find((r) => r.roomCode === roomCode);
    room.hasStarted = hasStarted;
    io.to(roomCode).emit("updateSHasStarted", hasStarted);
  });

  socket.on("clearRooms", () => {
    console.log(socket.rooms);
    socket.leaveAll();
  });

  socket.on("makeMove", ({ x, y, roomCode }) => {
    console.log("move made", x, y, roomCode, socket.id);
    socket.to(roomCode).emit("makeMove", { x, y });
  });

  socket.on("playerForfeit", (roomCode, id) => {
    console.log("forfeit");
    socket.to(roomCode).emit("playerForfeit", id);
  });
});

io.sockets.adapter.on("delete-room", (roomCode) => {
  rooms = rooms.filter((room) => {
    if (room.roomCode === roomCode) {
      console.log("deleted room: " + roomCode);
    }
    return !(room.roomCode === roomCode);
  });
});
io.sockets.adapter.on("create-room", (roomCode) => {
  console.log("created room: " + roomCode);
});
io.sockets.adapter.on("leave-room", (roomCode, id) => {
  rooms.forEach((room) => {
    if (room.roomCode === roomCode) {
      room.users = room.users.filter((user) => {
        console.log(user.socketId + " left room: " + roomCode);
        if (user.socketId === id) {
          console.log("forfeited: " + user.uname);
          io.to(roomCode).emit("playerForfeit", user.id);
        }
        return user.socketId !== id;
      });
      room.users = room.users.map((user, index) => {
        user.id = index + 1;
        user.color = colors[index + 1];
        return user;
      });
      io.to(roomCode).emit("updatePlayers", room.users);
    }
  });
});

httpServer.listen(PORT);
