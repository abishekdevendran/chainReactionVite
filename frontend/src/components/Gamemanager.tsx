import toast from "react-hot-toast";
import Board from "./Board";
import { motion } from "framer-motion";

const Gamemanager = ({players, setPlayers, hasStarted, setHasStarted,boardSize}) => {
  return (
      <motion.div
        className="absolute min-w-full min-h-full pt-32 sm:pt-16 flex flex-col items-center justify-center"
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.5 }}
      >
        <Board
          n={boardSize.m}
          m={boardSize.n}
          delay={1}
          players={players}
          setPlayers={setPlayers}
          hasStarted={hasStarted}
          setHasStarted={setHasStarted}
        />
      </motion.div>
  );
};

export default Gamemanager;
