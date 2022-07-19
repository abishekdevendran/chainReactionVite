import { useContext } from "react";
import { Navigate } from "react-router-dom";
import UserContext from "./contexts/UserContext";
import { motion } from "framer-motion";

function App() {
  const { user } = useContext(UserContext);
  if (user.isLoggedIn) {
    return <Navigate to="/game" replace />;
  } else {
    return (
      <motion.div
        className="absolute flex justify-center w-screen h-screen text-center select-none items-center font-poppins bg-bg-secondary"
        initial={{ x: "-100vw", y: 0 }}
        animate={{ x: 0, y: 0 }}
        exit={{ x: "100vw", y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-4xl font-semibold">Chain Reaction</h1>
        </div>
      </motion.div>
    );
  }
}

export default App;
