import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DarkModeContextProvider } from "./contexts/DarkModeContext";
import { UserContextProvider } from "./contexts/UserContext";
import Navbar from "./components/Navbar";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <DarkModeContextProvider>
      <UserContextProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<App />}></Route>
          </Routes>
        </BrowserRouter>
      </UserContextProvider>
    </DarkModeContextProvider>
  </React.StrictMode>
);
