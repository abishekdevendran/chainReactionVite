import React, { useContext, useEffect, useReducer, useState } from "react";
import toast from "react-hot-toast";
import { Navigate, useParams } from "react-router-dom";
import Gamemanager from "../components/Gamemanager";
import Lobby from "../components/Lobby";
import SocketContext from "../contexts/SocketContext";
import UserContext from "../contexts/UserContext";

// const players = [
//   {
//     id: 1,
//     uname: "Abishek",
//     color: "#3cccbc",
//     eliminated: false,
//     count: 0,
//     isReady: false,
//   },
//   {
//     id: 2,
//     uname: "Bordie",
//     color: "#905dae",
//     eliminated: false,
//     count: 0,
//     isReady: false,
//   },
//   {
//     id: 3,
//     uname: "Carroll",
//     color: "#0f00a5",
//     eliminated: false,
//     count: 0,
//     isReady: false,
//   },
// ];

interface Player {
  id: number;
  uname: string;
  color: string;
  eliminated: boolean;
  count: number;
  isReady: boolean;
}

const Game = () => {
  const { socket } = useContext(SocketContext);
  const { user } = useContext(UserContext);
  const { roomCode } = useParams();
  const [players, setPlayers] = useState<Player[]>([]);
  const [hasStarted, setHasStarted] = useState(false);
  const [isReady, setIsReady] = useReducer((state) => {
    players.find((player) => player.uname === user.uname)!.isReady = !state;
    socket.emit("updateReady", roomCode ,user, (players) => {
      setPlayers(players);
    });
    return !state;
  }, false);
  
  const roomJoinManager = () => {
    console.log(user);
    socket.emit("roomJoin", roomCode, user, (players) => {
      localStorage.removeItem("board");
      toast.success("Room joined successfully");
    });
  };

  useEffect(() => {
    if (roomCode) {
      roomJoinManager();
    }
  }, [roomCode]);

  useEffect(() => {
    socket.on("updatePlayers", (players) => {
      setPlayers(players);
    });
    socket.on("startGame", () => {
      setHasStarted(true);
    });
    return () => {
      socket.off("updatePlayers");
      socket.off("startGame");
    };
  }, []);

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center">
      {hasStarted ? (
        <Gamemanager players={players} setHasStarted={setHasStarted} />
      ) : (
        <Lobby players={players} isReady={isReady} setIsReady={setIsReady} />
      )}
    </div>
  );
};

export default Game;
