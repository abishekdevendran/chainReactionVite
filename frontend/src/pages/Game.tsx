import React, { useContext, useReducer, useState } from 'react'
import Gamemanager from '../components/Gamemanager'
import Lobby from '../components/Lobby';
import UserContext from '../contexts/UserContext';

const players = [
  {
    id: 1,
    uname: "Abishek",
    color: "#3cccbc",
    eliminated: false,
    count: 0,
    isReady: false,
  },
  {
    id: 2,
    uname: "Bordie",
    color: "#905dae",
    eliminated: false,
    count: 0,
    isReady: false,
  },
  {
    id: 3,
    uname: "Carroll",
    color: "#0f00a5",
    eliminated: false,
    count: 0,
    isReady: false,
  },
];

const Game = () => {
  const {user}=useContext(UserContext);
  const [hasStarted, setHasStarted] = useState(false);
  const [isReady, setIsReady] = useReducer((state)=>{
    players.find(player=>player.uname===user.uname)!.isReady=!state;
    return !state;
  },false);
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center">
      {hasStarted ? (
        <Gamemanager players={players} setHasStarted={setHasStarted} />
      ) : (
        <Lobby players={players} setIsReady={setIsReady} />
      )}
    </div>
  );
}

export default Game