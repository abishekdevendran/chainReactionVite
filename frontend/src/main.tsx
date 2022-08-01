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
            <MotionToast t={t}/>
            // <motion.div
            // >
            //   {resolveValue(t.message, t)}
            //   {t.icon}
            // </motion.div>
          )}
        </Toaster>
      </SocketContextProvider>
    </UserContextProvider>
  </DarkModeContextProvider>
);
