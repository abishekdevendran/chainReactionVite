import { AnimatePresence } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";
import App from "../App";
import Game from "../pages/Game";
import Login from "../pages/Login";
import Room from "../pages/Room";
import Navbar from "./Navbar";
import Protectedroute from "./Protectedroute";

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence initial={false} >
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<App />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/game">
          <Route
            path=""
            element={
              <Protectedroute>
                <Room />
              </Protectedroute>
            }
          />
          <Route
            path=":roomCode"
            element={
              <Protectedroute>
                <Game key={location.pathname}/>
              </Protectedroute>
            }
          />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
