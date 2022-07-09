import { Server } from "socket.io";

const io = new Server(5000, {
  /* options */
  cors: {
    origin: "*",
    credentials: true,
  },
});
console.log("Server started on port 5000");

io.on("connection", (socket) => {
  // ...
  console.log("a user connected: "+socket.id);
});
