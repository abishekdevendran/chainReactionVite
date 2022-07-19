import toast from "react-hot-toast";
import { MdContentCopy, MdShare } from "react-icons/md";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { useContext } from "react";
import SocketContext from "../contexts/SocketContext";

const Lobby = ({ players, isReady, setIsReady, boardSize, setBoardSize }) => {
  const { socket } = useContext(SocketContext);
  const { roomCode } = useParams();
  const copyManager = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Room Link copied to clipboard");
  };
  const shareManager = () => {
    navigator.share({
      title: document.title,
      text: "Come join your friends at Chain Reaction!",
      url: window.location.href,
    });
  };
  return (
    <motion.div
      className="abolute rounded overflow-hidden shadow-lg text-center w-5/6 sm:w-4/6 md:w-1/2 lg:w-1/3 bg-bg-secondary p-5 py-9"
      initial={{ x: "-100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-semibold text-primary mb-5">
        Chain Reaction
      </h1>
      <div className="flex flex-row justify-around items-center mb-5">
        {navigator.share! && (
          <motion.button
            className="copyButton bg-brand-primary text-brand-tertiary font-bold py-2 pl-2 pr-3 rounded-l-full"
            onClick={shareManager}
            whileHover={{ scale: 1.1 }}
          >
            <MdShare />
          </motion.button>
        )}
        <div className="copyField select-all text-center w-full">
          {roomCode}
        </div>
        <motion.button
          className="copyButton bg-brand-primary text-brand-tertiary font-bold py-2 pl-2 pr-3 rounded-r-full"
          onClick={copyManager}
          whileHover={{ scale: 1.1 }}
        >
          <MdContentCopy />
        </motion.button>
      </div>
      <div className="flex flex-row items-center justify-evenly">
        <select
          className="appearance-none block w-1/3
          px-3
          py-1.5
          text-center
          font-normal
          text-gray-700
          bg-white bg-clip-padding bg-no-repeat
          border border-solid border-gray-300
          rounded
          transition
          ease-in-out
          m-0
          focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
          onChange={(e) => {
            let newBoardSize = { m: parseInt(e.target.value), n: boardSize.n };
            setBoardSize(newBoardSize);
            socket.emit("updateBoardSize", roomCode, newBoardSize);
          }}
          defaultValue={String(boardSize.m)}
          value={String(boardSize.m)}
        >
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6 (Default)</option>
          <option value="7">7</option>
        </select>
        {"x"}
        <select
          className="appearance-none block w-1/3
          px-3
          py-1.5
          text-center
          font-normal
          text-gray-700
          bg-white bg-clip-padding bg-no-repeat
          border border-solid border-gray-300
          rounded
          transition
          ease-in-out
          m-0
          focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
          onChange={(e) => {
            let newBoardSize = { m: boardSize.m, n: parseInt(e.target.value) };
            setBoardSize(newBoardSize);
            socket.emit("updateBoardSize", roomCode, newBoardSize);
          }}
          defaultValue={String(boardSize.n)}
          value={String(boardSize.n)}
        >
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6 (Default)</option>
          <option value="7">7</option>
        </select>
      </div>
      {players.map((player) => {
        return (
          <div key={player.id}>
            {player.uname} - {player.color} -{" "}
            {player.isReady ? "Ready" : "Not Ready"}
          </div>
        );
      })}
      <motion.button
        onClick={setIsReady}
        className="bg-brand-primary text-brand-tertiary font-bold py-2 px-4 rounded mt-5 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-500"
        whileHover={{ scale: players.length > 0 ? 1.1 : 1 }}
        disabled={players.length > 0 ? false : true}
      >
        {isReady ? "UnReady" : "I am Ready!"}
      </motion.button>
    </motion.div>
  );
};

export default Lobby;
