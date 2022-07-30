import toast from "react-hot-toast";
import Board from "./Board";
import { motion } from "framer-motion";

const Gamemanager = ({players, setPlayers, hasStarted, setHasStarted,boardSize,setIsReady}) => {
  return (
      <motion.div
        className="absolute h-full w-full max-h-full max-w-full pt-24 flex flex-col items-center justify-center"
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
          setIsReady={setIsReady}
        />
      </motion.div>
  );
};

export default Gamemanager;
