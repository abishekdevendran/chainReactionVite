import React, {
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import Square from "./Square";
import popAudio from "../assets/pop.mp3";
import toast from "react-hot-toast";
import UserContext from "../contexts/UserContext";
import SocketContext from "../contexts/SocketContext";
import { useParams } from "react-router-dom";

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
  setHasStarted: (hasStarted: boolean) => void;
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
  setHasStarted,
}: BoardProps) => {
  const { roomCode } = useParams();
  const { socket } = useContext(SocketContext);
  const [dummyX, setDummyX] = useState(0);
  const [dummyY, setDummyY] = useState(0);
  const { user } = useContext(UserContext);
  const [canClick, setCanClick] = useState(true);
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
    console.log("turn changed");
    let n = 1;
    while (players[(turn + n) % players.length].eliminated) {
      if (n === players.length - 1) {
        winManager();
      }
      n++;
    }
    let newTurn = (turn + n) % players.length;
    console.log("newturn:", newTurn, "oldturn:", turn);
    return newTurn;
  }, 0);

  const createPop = () => {
    let audioinstance = new Audio(popAudio);
    audioinstance.volume = 0.02;
    audioinstance.play();
  };

  const forfeitManager = (id: number) => {
    console.log(`Player ${id} has forfeited`);
    toast(`Player ${id} has forfeited`);
    let foundIndex = players.findIndex((player) => player.id === id);
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
    if (remainderCount === 1) {
      winManager();
    }
    setBoard(newBoard);
  };

  const winManager = () => {
    let winner = players.find((player) => !player.eliminated);
    toast.success(`Player ${winner?.uname} has won!`);
    setCanClick(false);
    setTimeout(() => {
      setHasStarted(false);
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
    socket.emit("makeMove", { x, y, roomCode });
    moveHandler(x, y);
  };

  const moveHandler = (x: number, y: number) => {
    let newBoard = [...board];
    newBoard[y][x] = {
      value: board[y][x].value + 1,
      color: players[turn].color,
    };
    console.log(newBoard[y][x], players[turn], "turn:", turn);
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
  useEffect(() => {
    socket.on("makeMove", ({ x, y }) => {
      console.log("turn at socket");
      moveHandler(x, y);
    });
    return () => {
      socket.off("makeMove");
    };
  }, [turn, socket, board, players, setBoard, changeTurn, setCanClick]);

  return (
    <div
      className="font-poppins"
      style={{ backgroundColor: players[turn].color }}
    >
      Game Board {players[turn].uname}{" "}
      {players[turn].count > 0 ? `(${players[turn].count})` : `(0)`}
      <div className="board flex flex-col items-center justify-center">
        {board.map((row, i) => {
          return (
            <div key={i} className="board-row flex">
              {row.map((val: BoardValue, j: number) => {
                return (
                  <Square
                    key={j}
                    value={val.value}
                    color={val.color}
                    index={{ x: j, y: i }}
                    clickHandler={clickHandler}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
      <div>
        {players.map((player) => {
          return (
            <div key={player.id}>
              {player.uname} {player.count > 0 ? `(${player.count})` : `(0)`}
              <button onClick={() => forfeitManager(player.id)}>Foreit</button>
            </div>
          );
        })}
        <button onClick={() => changeTurn()}>Change Turn</button>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          moveHandler(dummyX, dummyY);
        }}
      >
        <input
          type="text"
          placeholder="x"
          onChange={(e) => setDummyX(parseInt(e.target.value))}
        />
        <input
          type="text"
          placeholder="y"
          onChange={(e) => setDummyY(parseInt(e.target.value))}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Board;
