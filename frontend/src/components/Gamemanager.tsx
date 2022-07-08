import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import Board from "./Board";
import { MdContentCopy, MdShare } from "react-icons/md";

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
        {
          navigator.share! && <button
          className="copyButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 pl-3 pr-2 rounded-l-full"
          onClick={shareManager}
        >
          <MdShare />
        </button>}
        <div className="copyField select-all">{roomCode}</div>
        <button
          className="copyButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 pl-2 pr-3 rounded-r-full"
          onClick={copyManager}
        >
          <MdContentCopy />
        </button>
      </div>
      <Board n={8} m={6} delay={1} players={players} />
    </div>
  );
};

export default Gamemanager;
