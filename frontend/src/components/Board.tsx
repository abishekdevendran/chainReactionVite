import { useContext, useEffect, useReducer, useRef, useState } from "react";
import Square from "./Square";
import popAudio from "../assets/pop.mp3";
import toast from "react-hot-toast";
import UserContext from "../contexts/UserContext";
import SocketContext from "../contexts/SocketContext";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ImVolumeHigh,
  ImVolumeLow, ImVolumeMedium, ImVolumeMute2,
} from "react-icons/im";

interface Player {
  id: number;
  uname: string;
  color: string;
  eliminated: boolean;
  count: number;
  isReady: boolean;
}

interface BoardProps {
  n: number;
  m: number;
  delay: number;
  players: Player[];
  setPlayers: (players: Player[]) => void;
  hasStarted: boolean;
  setHasStarted: (hasStarted: boolean) => void;
  setIsReady: (isReady: boolean) => void;
}

interface BoardValue {
  value: number;
  color: string;
}

const Board = ({
  n = 6,
  m = 8,
  delay = 1,
  players,
  setPlayers,
  hasStarted,
  setHasStarted,
  setIsReady
}: BoardProps) => {
  const { roomCode } = useParams();
  const { socket } = useContext(SocketContext);
  const { user } = useContext(UserContext);
  const [canClick, setCanClick] = useState(true);
  const [waitAfterWin, setWaitAfterWin] = useState(false);
  const [lastMove, setLastMove] = useState<{
    x: number;
    y: number;
    color: string;
  } | null>(null);
  const [volume, setVolume] = useState(100);
  const [volumeVisibility, toggleVolumeVisibility] = useReducer(
    (state: boolean) => !state,
    false
  );
  const [board, setBoard] = useState(() => {
    return Array(m)
      .fill(0)
      .map((row) =>
        new Array(n).fill(0).map(() => {
          return { value: 0, color: "gray" };
        })
      );
  });
  const [turn, changeTurn] = useReducer((turn) => {
    let n = 1;
    while (players[(turn + n) % players.length].eliminated) {
      if (n === players.length - 1) {
        winManager();
      }
      n++;
    }
    let newTurn = (turn + n) % players.length;
    return newTurn;
  }, 0);

  const createPop = () => {
    let audioinstance = new Audio(popAudio);
    audioinstance.volume = 0.1*volume/100;
    audioinstance.play();
  };

  const forfeitManager = (id: number) => {
    let forfeitPlayer = players.find((player) => player.id === id);
    let foundIndex = players.findIndex((player) => player.id === id);
    console.log(`Player ${forfeitPlayer?.uname} has forfeited`);
    toast(`Player ${forfeitPlayer?.uname} has forfeited`);
    let newBoard = [...board];
    newBoard.forEach((row) => {
      row.forEach((square) => {
        if (square.color === players[foundIndex].color) {
          square.color = "gray";
        }
      });
    });
    players[foundIndex].eliminated = true;
    if (turn === foundIndex) {
      changeTurn();
    }
    let remainderCount = players.filter((player) => !player.eliminated).length;
    setPlayers([...players]);
    if (remainderCount === 1) {
      winManager();
    }
    setBoard(newBoard);
  };

  const winManager = () => {
    let winner = players.find((player) => !player.eliminated);
    toast.success(`Player ${winner?.uname} has won!`);
    setCanClick(false);
    setWaitAfterWin(true);
    setTimeout(() => {
      setHasStarted(false);
      setIsReady(false);
      // socket.emit("readyReset", roomCode);
    }, 5 * delay * 1000);
  };

  const explosionCheck = (x: number, y: number) => {
    //corner check
    if (
      (x === 0 && y === 0) ||
      (x === 0 && y === m - 1) ||
      (x === n - 1 && y === 0) ||
      (x === n - 1 && y === m - 1)
    ) {
      if (board[y][x].value >= 2) {
        return true;
      }
    }
    //edge check
    else if (x === 0 || x === n - 1 || y === 0 || y === m - 1) {
      if (board[y][x].value >= 3) {
        return true;
      }
    } else {
      if (board[y][x].value >= 4) {
        return true;
      }
    }
    return false;
  };

  const explosionManager = (explosions: { x: number; y: number }[]) => {
    let newBoard = [...board];
    let newExplosions: { x: number; y: number }[] = [];
    explosions.forEach(({ x, y }) => {
      //clear spot of explosion
      // newBoard[y][x] = { value: 0, color: "gray" };
      //corner and edge check
      if (x === 0) {
        if (y === 0) {
          newExplosions.push({ x: x + 1, y: y });
          newExplosions.push({ x: x, y: y + 1 });
          newBoard[y][x] = {
            value: newBoard[y][x].value - 2,
            color: newBoard[y][x].value === 2 ? "gray" : players[turn].color,
          };
        } else if (y === m - 1) {
          newExplosions.push({ x: x + 1, y: y });
          newExplosions.push({ x: x, y: y - 1 });
          newBoard[y][x] = {
            value: newBoard[y][x].value - 2,
            color: newBoard[y][x].value === 2 ? "gray" : players[turn].color,
          };
        } else {
          newExplosions.push({ x: x + 1, y: y });
          newExplosions.push({ x: x, y: y + 1 });
          newExplosions.push({ x: x, y: y - 1 });
          newBoard[y][x] = {
            value: newBoard[y][x].value - 3,
            color: newBoard[y][x].value === 3 ? "gray" : players[turn].color,
          };
        }
      } else if (x === n - 1) {
        if (y === 0) {
          newExplosions.push({ x: x - 1, y: y });
          newExplosions.push({ x: x, y: y + 1 });
          newBoard[y][x] = {
            value: newBoard[y][x].value - 2,
            color: newBoard[y][x].value === 2 ? "gray" : players[turn].color,
          };
        } else if (y === m - 1) {
          newExplosions.push({ x: x - 1, y: y });
          newExplosions.push({ x: x, y: y - 1 });
          newBoard[y][x] = {
            value: newBoard[y][x].value - 2,
            color: newBoard[y][x].value === 2 ? "gray" : players[turn].color,
          };
        } else {
          newExplosions.push({ x: x - 1, y: y });
          newExplosions.push({ x: x, y: y + 1 });
          newExplosions.push({ x: x, y: y - 1 });
          newBoard[y][x] = {
            value: newBoard[y][x].value - 3,
            color: newBoard[y][x].value === 3 ? "gray" : players[turn].color,
          };
        }
      } else if (y === 0) {
        newExplosions.push({ x: x + 1, y: y });
        newExplosions.push({ x: x - 1, y: y });
        newExplosions.push({ x: x, y: y + 1 });
        newBoard[y][x] = {
          value: newBoard[y][x].value - 3,
          color: newBoard[y][x].value === 3 ? "gray" : players[turn].color,
        };
      } else if (y === m - 1) {
        newExplosions.push({ x: x + 1, y: y });
        newExplosions.push({ x: x - 1, y: y });
        newExplosions.push({ x: x, y: y - 1 });
        newBoard[y][x] = {
          value: newBoard[y][x].value - 3,
          color: newBoard[y][x].value === 3 ? "gray" : players[turn].color,
        };
      } else {
        newExplosions.push({ x: x + 1, y: y });
        newExplosions.push({ x: x - 1, y: y });
        newExplosions.push({ x: x, y: y + 1 });
        newExplosions.push({ x: x, y: y - 1 });
        newBoard[y][x] = {
          value: newBoard[y][x].value - 4,
          color: newBoard[y][x].value === 4 ? "gray" : players[turn].color,
        };
      }
    });
    //update explosions and counts to board
    newExplosions.forEach(({ x, y }) => {
      if (newBoard[y][x].value !== 0) {
        players[turn].count += newBoard[y][x].value;
        let foundPlayer = players.find(
          (player) => player.color === newBoard[y][x].color
        );
        if (foundPlayer) {
          foundPlayer!.count -= newBoard[y][x].value;
          if (foundPlayer!.count <= 0) {
            foundPlayer!.eliminated = true;
            console.log(`${foundPlayer!.uname} has been eliminated`);
            toast.success(`${foundPlayer!.uname} has been eliminated`);
          }
        }
      }
      newBoard[y][x] = {
        value: board[y][x].value + 1,
        color: players[turn].color,
      };
    });
    setPlayers([...players]);
    setBoard(newBoard);
    createPop();

    //Stop Looping on win conition
    if (players.filter((player) => !player.eliminated).length === 1) {
      winManager();
      return;
    }

    //eliminate duplicates
    newExplosions = newExplosions.filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.x === value.x && t.y === value.y)
    );
    // newExplosions = newExplosions.filter(
    //   (item, index) => newExplosions.indexOf(item) === index
    // )
    //eliminate false explosions
    newExplosions = newExplosions.filter((explosion) => {
      return explosionCheck(explosion.x, explosion.y);
    });
    //exit if no more explosions
    if (newExplosions.length === 0) {
      changeTurn();
      setCanClick(true);
      return;
    } else {
      //continue recursion after timeout of given seconds
      setTimeout(() => {
        explosionManager(newExplosions);
      }, delay * 200);
    }
  };

  const clickHandler = (e, x: number, y: number) => {
    e.stopPropagation();
    console.log(`${players[turn].uname} clicked ${x}, ${y}`);
    if (!canClick) {
      return;
    }
    if (players[turn].uname !== user.uname) {
      toast.error("Wait your turn");
      return;
    }
    // //If not valid move, return.
    if (board[y][x].color !== players[turn].color && board[y][x].value !== 0) {
      console.log("Invalid move");
      toast.error("Invalid move");
      return;
    }
    moveHandler(x, y);
    socket.emit("makeMove", { x, y, roomCode });
  };

  const moveHandler = (x: number, y: number) => {
    console.log(`${players[turn].uname} moved ${x}, ${y}`, turn);
    setLastMove({ x: x, y: y, color: players[turn].color });
    let newBoard = [...board];
    newBoard[y][x] = {
      value: board[y][x].value + 1,
      color: players[turn].color,
    };
    setBoard(newBoard);
    createPop();
    //Increment count for player
    players[turn].count++;
    //If no explosions caused, return.
    if (explosionCheck(x, y) === false) {
      changeTurn();
      return;
    } else {
      setCanClick(false);
      let explosions: { x: number; y: number }[] = [{ x, y }];
      explosionManager(explosions);
    }
  };

  //Ill never get back the last 3 hours of my life. Stupid dependency array. Might as well put every state in event listener deps lol kekw.
  //Update:friggin piece of shit is causing more problems idk the solution to.
  useEffect(() => {
    socket.on("makeMove", ({ x, y }) => {
      moveHandler(x, y);
    });
    socket.on("playerForfeit", (id) => {
      forfeitManager(id);
    });
    return () => {
      socket.off("makeMove");
      socket.off("playerForfeit");
    };
  }, [turn]);

  const volumeItem = useRef<any>(null);
  useEffect(() => {
    let mouseUpHandler = (e) => {
      if (!volumeItem.current?.contains(e.target) && volumeVisibility) {
        toggleVolumeVisibility();
      }
    };

    document.addEventListener("mouseup", mouseUpHandler);

    return () => {
      document.removeEventListener("mouseup", mouseUpHandler);
    };
  }, [volumeItem,volumeVisibility,toggleVolumeVisibility]);

  return (
    <motion.div
      className={`font-poppins h-4/6 w-5/6 flex absolute text-center items-stretch justify-evenly rounded-md p-2 flex-col lg:flex-row select-none`}
      style={{ backgroundColor: players[turn]?.color }}
      initial={{ x: "-100vw", y: 0 }}
      animate={{ x: 0, y: 0 }}
      exit={{ x: "100vw", y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="top-container flex items-center justify-center">
        <div className="titles flex items-center justify-center text-center">
          {players[turn].uname}
          {"'s turn "}
          {players[turn].count > 0 ? `(${players[turn].count})` : `(0)`}
        </div>
        <div className="volume relative ml-2" ref={volumeItem}>
          {volume > 0 ? (
            volume > 33 ? (
              volume > 66 ? (
                <ImVolumeHigh size={30} onClick={toggleVolumeVisibility} />
              ) : (
                <ImVolumeMedium size={30} onClick={toggleVolumeVisibility} />
              )
            ) : (
              <ImVolumeLow size={30} onClick={toggleVolumeVisibility} />
            )
          ) : (
            <ImVolumeMute2 size={30} onClick={toggleVolumeVisibility} />
          )}
          {volumeVisibility && (
            <div className="absolute text-center rounded-3xl right-1/2 bottom-8 bg-bg-primary">
              <input
                value={volume}
                type="range"
                min="0"
                max="100"
                onChange={(e) => setVolume(parseInt(e.target.value))}
              />
            </div>
          )}
        </div>
      </div>
      <div
        className="board max-h-full max-w-full self-center flex flex-col justify-center items-center bg-white rounded-lg"
        style={{ aspectRatio: `${n}/${m}` }}
      >
        {board.map((row, i) => {
          return (
            <div
              key={i}
              className="board-row flex items-center justify-stretch"
            >
              {row.map((val: BoardValue, j: number) => {
                let lastMoveSquare = lastMove?.x === j && lastMove?.y === i;
                return (
                  <Square
                    key={j}
                    value={val.value}
                    color={val.color}
                    index={{ x: j, y: i }}
                    clickHandler={clickHandler}
                    lastMoveSquare={lastMoveSquare ? lastMove?.color : false}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
      <div className="stats p-2 flex flex-col items-center justify-center text-center">
        {players.map((player, i) => {
          return (
            <div
              className="py-1 px-3 w-full text-center rounded-3xl"
              key={player.id}
              style={{ backgroundColor: players[i]?.color }}
            >
              {player.uname} {player.count > 0 ? `(${player.count})` : `(0)`}
              {player.uname === user.uname && (
                <motion.button
                  className="bg-brand-primary text-brand-tertiary font-bold px-4 rounded mx-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-500"
                  whileHover={{ scale: !waitAfterWin ? 1.1 : 1 }}
                  disabled={!waitAfterWin ? false : true}
                  onClick={() => {
                    socket.emit("playerForfeit", roomCode, player.id);
                    forfeitManager(player.id);
                  }}
                >
                  Forfeit
                </motion.button>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default Board;
