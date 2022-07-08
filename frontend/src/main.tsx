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

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <DarkModeContextProvider>
      <UserContextProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<App />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route
              path="/game"
              element={
                <Protectedroute>
                  <Game />
                </Protectedroute>
              }
            ></Route>
          </Routes>
        </BrowserRouter>
        <Toaster />
      </UserContextProvider>
    </DarkModeContextProvider>
  </React.StrictMode>
);
