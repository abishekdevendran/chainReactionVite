import { generateSlug } from "random-word-slugs";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import SocketContext from "../contexts/SocketContext";
import { motion } from "framer-motion";

const Room = () => {
  const { socket } = useContext(SocketContext);
  const [data, setData] = useState("");
  const navigate = useNavigate();
  const roomJoinHandler = (e) => {
    if (data.length <= 2) {
      toast.error("Not a valid room code");
      return;
    }
    e.preventDefault();
    navigate(`/game/${data}`);
  };
  const roomCreateHandler = (e) => {
    e.preventDefault();
    let roomCode = generateSlug(1);
    navigate(`/game/${roomCode}`);
  };
  useEffect(() => {
    console.log("Roooms cleared");
    socket.emit("clearRooms");
  },[])
  return (
    <motion.div
      className="min-h-screen flex items-center justify-center h-screen bg-bg-primary"
      initial={{ x: -window.innerWidth }}
      animate={{ x: 0 }}
      exit={{ x: window.innerWidth }}
    >
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
    </motion.div>
  );
};

export default Room;
