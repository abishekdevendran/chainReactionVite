import { generateSlug } from "random-word-slugs";
import React, { useContext, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import SocketContext from "../contexts/SocketContext";
import UserContext from "../contexts/UserContext";

const Room = () => {
  const [data, setData] = useState("");
  const { socket } = useContext(SocketContext);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const roomJoinManager = (roomCode) => {
    console.log(user);
    socket.emit("roomJoin", roomCode, user, (err) => {
      if (err) {
        toast.error(err);
      } else {
        localStorage.removeItem("board");
        toast.success("Room joined successfully");
        navigate(`/game/${roomCode}`);
      }
    });
  };
  const roomJoinHandler = (e) => {
    if (data.length <= 2) {
      toast.error("Not a valid room code");
      return;
    }
    e.preventDefault();
    roomJoinManager(data);
  };
  const roomCreateHandler = (e) => {
    e.preventDefault();
    let roomCode = generateSlug(1);
    roomJoinManager(roomCode);
  };
  return (
    <div className="min-h-screen flex items-center justify-center h-screen bg-bg-primary">
      <form onSubmit={roomJoinHandler}>
        <label>RoomCode:</label>
        <input
          required
          type="text"
          name="username"
          placeholder="ex: minister-of-fame"
          onChange={(e) => setData(e.target.value)}
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          type="submit"
        >
          Join Room
        </button>
        <button
          onClick={roomCreateHandler}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Create Room
        </button>
      </form>
    </div>
  );
};

export default Room;
