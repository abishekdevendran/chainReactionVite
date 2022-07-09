import { Server } from "socket.io";

const io = new Server(5000, {
  /* options */
  cors: {
    origin: "*",
    transports: ["websocket", "polling"],
  },
});
console.log("Server started on port 5000");

let rooms = [];

io.on("connection", (socket) => {
  socket.on("roomJoin", (roomCode, user) => {
    socket.join(roomCode);
    console.log("joined room: " + roomCode);
    let room = rooms.find((r) => r.roomCode === roomCode);
    let userObject = {
      id: room? room.users.length+1 : 1,
      uname: user.uname,
      color: "#3cccbc",
      eliminated: false,
      count: 0,
      isReady: false,
    };
    if (!room) {
      room = { roomCode: roomCode, users: [userObject] };
      rooms.push(room);
    } else {
      room.users.push(userObject);
    }
    console.log(userObject);
  });
});

io.sockets.adapter.on("delete-room", (roomCode) => {
  rooms=rooms.filter((room) => {
    if (room.roomCode === roomCode) {
      console.log("deleted room: " + roomCode);
    }
    return !(room.roomCode === roomCode);
  });
});
io.sockets.adapter.on("create-room", (roomCode) => {
  console.log("created room: " + roomCode);
});
