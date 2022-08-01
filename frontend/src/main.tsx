import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { DarkModeContextProvider } from "./contexts/DarkModeContext";
import { UserContextProvider } from "./contexts/UserContext";
import { Toaster, resolveValue } from "react-hot-toast";
import { SocketContextProvider } from "./contexts/SocketContext";
import AnimatedRoutes from "./components/AnimatedRoutes";
import Navbar from "./components/Navbar";
import { motion } from "framer-motion";
import MotionToast from "./components/MotionToast";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <DarkModeContextProvider>
    <UserContextProvider>
      <SocketContextProvider>
        <BrowserRouter>
          <Navbar />
          <AnimatedRoutes />
        </BrowserRouter>
        <Toaster>
          {(t) => (
            <motion.div
              className="bg-bg-secondary text-primary p-3 rounded-3xl ease-in-out transition-colors"
              initial={{ y: "-100%" }}
              animate={{
                y: t.visible ? "0%" : "-200%",
                opacity: t.visible ? 1 : 0,
              }}
              exit={{ opacity: 0, y: "-200%" }}
            >
              {resolveValue(t.message, t)}
            </motion.div>
          )}
        </Toaster>
      </SocketContextProvider>
    </UserContextProvider>
  </DarkModeContextProvider>
);
