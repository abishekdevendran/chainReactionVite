import React from 'react'

const Lobby = ({players, setIsReady}) => {
  return (
    <div>
      Lobby
      {players.map((player) => {
        return (
          <div key={player.color}>
            {player.uname} - {player.color} - {player.isReady ? 'Ready' : 'Not Ready'}
          </div>
        );
      })}
      <button onClick={setIsReady}>Start Game</button>
    </div>
  );
}

export default Lobby