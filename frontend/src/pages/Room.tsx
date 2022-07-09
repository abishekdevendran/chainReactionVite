import { generateSlug } from "random-word-slugs";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Room = () => {
  const [data, setData] = useState("");
  const navigate = useNavigate();
  const roomJoinHandler = (e) => {
    if (data.length <= 2) {
      toast.error("Not a valid room code");
      return;
    }
    e.preventDefault();
    localStorage.removeItem("board");
    navigate(`/game/${data}`);
  };
  const roomCreateHandler = (e) => {
    e.preventDefault();
    let roomCode = generateSlug(1);
    localStorage.removeItem("board");
    navigate(`/game/${roomCode}`);
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
