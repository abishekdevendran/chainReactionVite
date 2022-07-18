import { AnimatePresence } from "framer-motion";
import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import App from "../App";
import Game from "../pages/Game";
import Login from "../pages/Login";
import Room from "../pages/Room";
import Protectedroute from "./Protectedroute";

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence>
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
                <Game />
              </Protectedroute>
            }
          />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
