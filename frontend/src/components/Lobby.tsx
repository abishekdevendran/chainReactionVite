import React from 'react'

const Lobby = ({players, isReady,setIsReady}) => {
  return (
    <div>
      Lobby
      {players.map((player) => {
        return (
          <div key={player.id}>
            {player.uname} - {player.color} - {player.isReady ? 'Ready' : 'Not Ready'}
          </div>
        );
      })}
      <button onClick={setIsReady}>{isReady?"UnReady":"I am Ready!"}</button>
    </div>
  );
}

export default Lobby