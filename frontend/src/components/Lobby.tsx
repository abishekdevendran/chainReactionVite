import toast from "react-hot-toast";
import { MdContentCopy, MdShare } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";

const Lobby = ({ players, isReady, setIsReady }) => {
  const copyManager = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Room Code copied to clipboard");
  };
  const shareManager = () => {
    navigator.share({
      title: document.title,
      text: "Come join your friend at Chain Reaction!",
      url: window.location.href,
    });
  };
  return (
      <motion.div
        className="abolute rounded overflow-hidden shadow-lg text-center w-5/6 sm:w-4/6 md:w-1/2 lg:w-1/3 bg-bg-secondary p-5 py-9"
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-semibold text-primary mb-5">
          Chain Reaction
        </h1>
        <div className="flex flex-row justify-around items-center mb-5">
          {navigator.share! && (
            <motion.button
              className="copyButton bg-brand-primary text-brand-tertiary font-bold py-2 pl-2 pr-3 rounded-l-full"
              onClick={shareManager}
              whileHover={{ scale: 1.1 }}
            >
              <MdShare />
            </motion.button>
          )}
          <div className="copyField select-all">{window.location.href}</div>
          <motion.button
            className="copyButton bg-brand-primary text-brand-tertiary font-bold py-2 pl-2 pr-3 rounded-r-full"
            onClick={copyManager}
            whileHover={{ scale: 1.1 }}
          >
            <MdContentCopy />
          </motion.button>
        </div>
        {players.map((player) => {
          return (
            <div key={player.id}>
              {player.uname} - {player.color} -{" "}
              {player.isReady ? "Ready" : "Not Ready"}
            </div>
          );
        })}
        <motion.button
          onClick={setIsReady}
          className="bg-brand-primary text-brand-tertiary font-bold py-2 px-4 rounded mt-5"
          whileHover={{ scale: 1.1 }}
        >
          {isReady ? "UnReady" : "I am Ready!"}
        </motion.button>
      </motion.div>
  );
};

export default Lobby;
