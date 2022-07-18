import toast from "react-hot-toast";
import Board from "./Board";
import { AnimatePresence, motion } from "framer-motion";

const Gamemanager = ({players, setPlayers, setHasStarted}) => {
  return (
      <motion.div
        className="absolute min-w-full pt-16 flex flex-col items-center justify-center"
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.5 }}
      >
        <Board
          n={4}
          m={5}
          delay={1}
          players={players}
          setPlayers={setPlayers}
          setHasStarted={setHasStarted}
        />
      </motion.div>
  );
};

export default Gamemanager;
