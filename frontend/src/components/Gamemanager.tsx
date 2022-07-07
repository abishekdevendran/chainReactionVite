import React, { useReducer, useState } from 'react'
import Board from './Board'

const players = [
  {
    id: 1,
    uname: "Abishek",
    color: "#3cccbc",
    eliminated: false,
    count: 0,
  },
  {
    id: 2,
    uname: "Bordie",
    color: "#905dae",
    eliminated: false,
    count: 0,
  },
  {
    id: 3,
    uname: "Carroll",
    color: "#0f00a5",
    eliminated: false,
    count: 0,
  },
];

const Gamemanager = () => {
  return (
    <div className='GameManager pt-16 flex min-w-full flex-col items-center justify-center'>
      Gamemanager
      <Board n={8} m={6} delay={1} players={players}/>
    </div>
  );
}

export default Gamemanager