import toast from "react-hot-toast";
import { MdContentCopy, MdShare } from "react-icons/md";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { useContext, useEffect, useReducer, useRef, useState } from "react";
import SocketContext from "../contexts/SocketContext";
import { HexColorPicker } from "react-colorful";
import UserContext from "../contexts/UserContext";
import "./Lobby.css"

const Lobby = ({
  players,
  isReady,
  setIsReady,
  boardSize,
  setBoardSize,
  sHasStarted,
}) => {
  const { user } = useContext(UserContext);
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
  const colorPickerRef = useRef<any>(null);
  const colorButtonRef = useRef<any>(null);
  const [isColorPickerOpen, toggleColorPicker] = useReducer((state) => {
    console.log("state changed from",state," to ", !state);
    return !state;
  }, false);
  const [color, setColor] = useState(() => {
    const player = players.find((player) => player.uname === user.uname);
    if(player) {
      return player.color;
    }
    return "#7f2ccb";
  });
  // const [tempColor, setTempColor] = useState<string| null>();
  useEffect(() => {
    const mouseUpHandler = (e) => {
      if (!colorPickerRef.current.contains(e.target) && isColorPickerOpen && !colorButtonRef.current.contains(e.target)) {
        toggleColorPicker();
      }
    };
    document.addEventListener("mouseup", mouseUpHandler);
    if(!isColorPickerOpen && players?.length>0) {
      socket.emit("updateColor", roomCode, user, color);
    }
    return ()=>{
      document.removeEventListener("mouseup", mouseUpHandler)
    }
  }, [isColorPickerOpen, toggleColorPicker,socket,roomCode,user,color]);

  return (
    <motion.div
      className="abolute rounded overflow-hidden shadow-lg text-center w-5/6 sm:w-4/6 md:w-1/2 lg:w-1/3 bg-bg-secondary p-5 py-9"
      style={{backgroundColor: isColorPickerOpen && color}}
      initial={{ x: "-100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-semibold text-primary mb-5">
        Chain Reaction
      </h1>
      {sHasStarted && (
        <div className="font-semibold text-lg mb-5">
          Waiting for current game to end...
        </div>
      )}
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
      <div className="flex flex-row items-center justify-evenly relative">
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
          <div key={player.id} className="flex items-center justify-center">
            {player.uname} - {<div className="w-20px h-10px" style={{backgroundColor:player.color}}>{player.color}</div>} -{" "}
            {player.isReady ? "Ready" : "Not Ready"}
          </div>
        );
      })}
      <div className="relative flex items-center justify-evenly">
        <motion.button
          onClick={toggleColorPicker}
          className="bg-brand-primary text-brand-tertiary font-bold py-2 px-4 rounded mt-5 disabled:opacity-75 disabled:cursor-not-allowed disabled:bg-slate-500"
          disabled={isReady}
          ref={colorButtonRef}
          whileHover={{ scale: players.length > 0 ? 1.1 : 1 }}
        >
          {isColorPickerOpen ? "Lock color" : "ColorPicker"}
        </motion.button>
        <motion.button
          onClick={setIsReady}
          className="bg-brand-primary text-brand-tertiary font-bold py-2 px-4 rounded mt-5 disabled:opacity-75 disabled:cursor-not-allowed disabled:bg-slate-500"
          whileHover={{ scale: players.length > 0 ? 1.1 : 1 }}
          disabled={
            players.length > 0
              ? sHasStarted || isColorPickerOpen
                ? true
                : false
              : true
          }
        >
          {isReady ? "UnReady" : "I am Ready!"}
        </motion.button>
      </div>
      <div
        className="flex items-center justify-center mt-4"
        ref={colorPickerRef}
      >
        {isColorPickerOpen && (
          <HexColorPicker color={color} onChange={setColor} />
        )}
      </div>
    </motion.div>
  );
};

export default Lobby;
