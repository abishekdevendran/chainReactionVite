const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;

if (true) {
  console.log("production");
  app.use(express.static(path.join(__dirname, "frontend/dist")));
}

const io = new Server(httpServer, {
  /* options */
  cors: {
    origin: "*",
    transports: ["websocket", "polling"],
  },
});
console.log(`Server started on port ${PORT}`);

let rooms = [];

io.on("connection", (socket) => {
  socket.on("roomJoin", (roomCode, user, fn) => {
    socket.join(roomCode);
    console.log("joined room: " + roomCode);
    let room = rooms.find((r) => r.roomCode === roomCode);
    let userObject = {
      id: room ? room.users.length + 1 : 1,
      uname: user.uname,
      color: "#3cccbc",
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
      };
      rooms.push(room);
    } else {
      room.users.push(userObject);
      if (room.hasStarted) {
        socket.emit("startGame");
      }
    }
    console.log(userObject);
    io.to(roomCode).emit("updatePlayers", room.users);
    fn(room.users);
  });
  socket.on("updateReady", (roomCode, user) => {
    let room = rooms.find((r) => r.roomCode === roomCode);
    let player = room.users.find((u) => u.uname === user.uname);
    player.isReady = !player.isReady;
    console.log(player.isReady);
    if (room.users.length >= 2 && room.users.every((u) => u.isReady)) {
      room = { ...room, hasStarted: true };
      io.to(roomCode).emit("startGame", room.board);
    }
    io.to(roomCode).emit("updatePlayers", room.users);
  });

  socket.on("clearRooms", () => {
    console.log(socket.rooms);
    socket.leaveAll();
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
        return user.socketId !== id;
      });
      room.users = room.users.map((user, index) => {
        user.id = index + 1;
        return user;
      });
      io.to(roomCode).emit("updatePlayers", room.users);
    }
  });
});

httpServer.listen(PORT);
