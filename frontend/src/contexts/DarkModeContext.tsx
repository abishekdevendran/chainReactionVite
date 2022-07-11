import React, { createContext, useEffect, useState } from "react";

const DarkModeContext = createContext<any>({});

export const DarkModeContextProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(()=>{
    const darkMode = localStorage.getItem("darkMode");
    return darkMode ? JSON.parse(darkMode) : false;
  });
  //I leave this comment here in memory of 3+ hours of my time I spent debugging this, only to find the error to be a wrong
  //Type conversion. localStorage.getItem("darkMode") is a string, but I wanted it to be a boolean.

  //Welcome back to another day same bug shit where I just figured out that localstorage doesnt implicitly work on android.
  //Nvm turns out it was useLayoutEffect

  //Update on CR project: Turns out this Useeffect was useless. I could just use getter functions inside setstate init. Sheesh.
  // useEffect(() => {
  //   const value = localStorage.getItem("darkMode")?.toLowerCase() === "true";
  //   console.log(value);
  //   if (value === null) {
  //     localStorage.setItem("darkMode", darkMode.toString());
  //   } else {
  //     setDarkMode(value);
  //   }
  // }, []);

  useEffect(() => {
    if (darkMode === true) {
      document.documentElement?.classList.add("dark");
    } else {
      document.documentElement?.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  return (
    <DarkModeContext.Provider
      value={{ darkMode: darkMode, setDarkMode: setDarkMode }}
    >
      {children}
    </DarkModeContext.Provider>
  );
};

export default DarkModeContext;
