import toast from "react-hot-toast";
import Board from "./Board";

const Gamemanager = ({players, setHasStarted}) => {
  return (
    <div className="GameManager pt-16 flex min-w-full flex-col items-center justify-center">
      
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
