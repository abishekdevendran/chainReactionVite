import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { DarkModeContextProvider } from "./contexts/DarkModeContext";
import { UserContextProvider } from "./contexts/UserContext";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import { SocketContextProvider } from "./contexts/SocketContext";
import AnimatedRoutes from "./components/AnimatedRoutes";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <DarkModeContextProvider>
    <UserContextProvider>
      <SocketContextProvider>
          <BrowserRouter key={window.location.href}>
            <Navbar />
            <AnimatedRoutes/>
          </BrowserRouter>
        <Toaster />
      </SocketContextProvider>
    </UserContextProvider>
  </DarkModeContextProvider>
);
