import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DarkModeContextProvider } from "./contexts/DarkModeContext";
import { UserContextProvider } from "./contexts/UserContext";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Protectedroute from "./components/Protectedroute";
import Game from "./pages/Game";
import Login from "./pages/Login";
import Room from "./pages/Room";
import { SocketContextProvider } from "./contexts/SocketContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <DarkModeContextProvider>
      <UserContextProvider>
        <SocketContextProvider>
          <BrowserRouter>
            <Navbar />
            <Routes>
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
          </BrowserRouter>
          <Toaster />
        </SocketContextProvider>
      </UserContextProvider>
    </DarkModeContextProvider>
  </React.StrictMode>
);
