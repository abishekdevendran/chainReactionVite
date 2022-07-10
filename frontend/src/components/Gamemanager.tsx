import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import Board from "./Board";
import { MdContentCopy, MdShare } from "react-icons/md";

const Gamemanager = ({players, setHasStarted}) => {
  const { roomCode } = useParams();

  const copyManager = () => {
    navigator.clipboard.writeText(roomCode!);
    toast.success("Room Code copied to clipboard");
  };
  const shareManager = () => {
    navigator.share({title:document.title,text: roomCode!});
  };
  return (
    <div className="GameManager pt-16 flex min-w-full flex-col items-center justify-center">
      <div className="flex flex-row justify-around items-center">
        {navigator.share! && (
          <button
            className="copyButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 pl-3 pr-2 rounded-l-full"
            onClick={shareManager}
          >
            <MdShare />
          </button>
        )}
        <div className="copyField select-all">{roomCode}</div>
        <button
          className="copyButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 pl-2 pr-3 rounded-r-full"
          onClick={copyManager}
        >
          <MdContentCopy />
        </button>
      </div>
      <Board
        n={4}
        m={5}
        delay={1}
        players={players}
        setHasStarted={setHasStarted}
      />
    </div>
  );
};

export default Gamemanager;
