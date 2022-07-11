import toast from 'react-hot-toast';
import { MdContentCopy, MdShare } from 'react-icons/md';

const Lobby = ({players, isReady,setIsReady}) => {

  const copyManager = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Room Code copied to clipboard");
  };
  const shareManager = () => {
    navigator.share({ title: document.title, text: "Come join your friend at Chain Reaction!", url: window.location.href });
  };
  return (
    <div>
      Lobby
      <div className="flex flex-row justify-around items-center">
        {navigator.share! && (
          <button
            className="copyButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 pl-3 pr-2 rounded-l-full"
            onClick={shareManager}
          >
            <MdShare />
          </button>
        )}
        <div className="copyField select-all">{window.location.href}</div>
        <button
          className="copyButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 pl-2 pr-3 rounded-r-full"
          onClick={copyManager}
        >
          <MdContentCopy />
        </button>
      </div>
      {players.map((player) => {
        return (
          <div key={player.id}>
            {player.uname} - {player.color} -{" "}
            {player.isReady ? "Ready" : "Not Ready"}
          </div>
        );
      })}
      <button onClick={setIsReady}>
        {isReady ? "UnReady" : "I am Ready!"}
      </button>
    </div>
  );
}

export default Lobby