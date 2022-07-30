import { generateSlug } from "random-word-slugs";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
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
    navigate(0);
  };
  const roomCreateHandler = (e) => {
    e.preventDefault();
    let roomCode = generateSlug(1);
    navigate(`/game/${roomCode}`);
    navigate(0);
  };
  useEffect(() => {
    console.log("Roooms cleared");
    socket.emit("clearRooms");
  },[])

  useLayoutEffect(() => {
    document.title = "Chain Reaction";
  },[])
  return (
    <motion.div
      className="absolute min-w-full min-h-screen flex items-center justify-center h-screen bg-bg-primary ease-in-out transition-colors duration-300"
      initial={{ x: "-100vw", y: 0 }}
      animate={{ x: 0, y: 0 }}
      exit={{ x: "100vw", y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <form
        onSubmit={roomJoinHandler}
        className="max-w-sm rounded overflow-hidden shadow-lg text-center w-5/6 bg-bg-secondary p-5 py-9"
      >
        <h1 className="text-4xl font-semibold text-primary mb-5">
          Chain Reaction
        </h1>
        <h2 className="text-xl font-semibold text-primary mb-5">Room Code:</h2>
        <input
          required
          type="text"
          name="username"
          placeholder="ex: minister-of-fame"
          onChange={(e) => setData(e.target.value)}
          className="bg-bg-secondary border-b-2 border-brand-tertiary focus:outline-none focus:border-brand-primary focus:border-brand-primary-lg py-2 px-4 rounded text-brand-primary-lg"
        />
        <div className="mt-5 flex items-center justify-center">
          <motion.button
            className="bg-brand-primary text-brand-tertiary font-bold py-2 px-4 rounded mx-2"
            type="submit"
            whileHover={{ scale: 1.1 }}
          >
            Join Room
          </motion.button>
          <motion.button
            onClick={roomCreateHandler}
            className="bg-brand-primary text-brand-tertiary font-bold py-2 px-4 rounded mx-2"
            whileHover={{ scale: 1.1 }}
          >
            Create Room
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default Room;
