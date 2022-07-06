import React, { useState } from "react";
import Square from "./Square";

interface BoardProps {
  n: number;
  m: number;
  color: string;
  delay: number;
}

interface BoardValue {
  value: number;
  color: string;
}

const Board = ({ n = 6, m = 8, color = "red", delay = 1 }: BoardProps) => {
  const [canClick, setCanClick] = useState(true);
  const [board, setBoard] = useState(
    Array(m)
      .fill(0)
      .map((row) =>
        new Array(n).fill(0).map(() => {
          return { value: 0, color: "gray" };
        })
      )
  );

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
          newBoard[y][x] = { value: newBoard[y][x].value - 2, color: newBoard[y][x].value===2?"gray":color };
        } else if (y === m - 1) {
          newExplosions.push({ x: x + 1, y: y });
          newExplosions.push({ x: x, y: y - 1 });
          newBoard[y][x] = { value: newBoard[y][x].value - 2, color: newBoard[y][x].value===2?"gray":color };
        } else {
          newExplosions.push({ x: x + 1, y: y });
          newExplosions.push({ x: x, y: y + 1 });
          newExplosions.push({ x: x, y: y - 1 });
          newBoard[y][x] = { value: newBoard[y][x].value - 3, color: newBoard[y][x].value===3?"gray":color };
        }
      } else if (x === n - 1) {
        if (y === 0) {
          newExplosions.push({ x: x - 1, y: y });
          newExplosions.push({ x: x, y: y + 1 });
          newBoard[y][x] = { value: newBoard[y][x].value - 2, color: newBoard[y][x].value===2?"gray":color };
        } else if (y === m - 1) {
          newExplosions.push({ x: x - 1, y: y });
          newExplosions.push({ x: x, y: y - 1 });
          newBoard[y][x] = { value: newBoard[y][x].value - 2, color: newBoard[y][x].value===2?"gray":color };
        } else {
          newExplosions.push({ x: x - 1, y: y });
          newExplosions.push({ x: x, y: y + 1 });
          newExplosions.push({ x: x, y: y - 1 });
          newBoard[y][x] = { value: newBoard[y][x].value - 3, color: newBoard[y][x].value===3?"gray":color };
        }
      } else if (y === 0) {
        newExplosions.push({ x: x + 1, y: y });
        newExplosions.push({ x: x - 1, y: y });
        newExplosions.push({ x: x, y: y + 1 });
        newBoard[y][x] = { value: newBoard[y][x].value - 3, color: newBoard[y][x].value===3?"gray":color };
      } else if (y === m - 1) {
        newExplosions.push({ x: x + 1, y: y });
        newExplosions.push({ x: x - 1, y: y });
        newExplosions.push({ x: x, y: y - 1 });
        newBoard[y][x] = { value: newBoard[y][x].value - 3, color: newBoard[y][x].value===3?"gray":color };
      } else {
        newExplosions.push({ x: x + 1, y: y });
        newExplosions.push({ x: x - 1, y: y });
        newExplosions.push({ x: x, y: y + 1 });
        newExplosions.push({ x: x, y: y - 1 });
        newBoard[y][x] = { value: newBoard[y][x].value - 4, color: newBoard[y][x].value===4?"gray":color };
      }
    });
    //update explosions to board
    newExplosions.forEach(({ x, y }) => {
      newBoard[y][x] = { value: board[y][x].value + 1, color: color };
    });
    setBoard(newBoard);
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

    if (newExplosions.length === 0) {
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
    // //If not valid move, return.
    if (board[y][x].color !== color && board[y][x].color !== "gray") {
      console.log("Invalid move");
      return;
    }
    let newBoard = [...board];
    newBoard[y][x] = { value: board[y][x].value + 1, color: color };
    setBoard(newBoard);
    // //If no explosions caused, return.
    if (explosionCheck(x, y) === false) {
      console.log("No explosions");
      return;
    } else {
      setCanClick(false);
      let explosions: { x: number; y: number }[] = [{ x, y }];
      explosionManager(explosions);
    }
  };

  return (
    <div className="font-poppins">
      Game Board
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
    </div>
  );
};

export default Board;
