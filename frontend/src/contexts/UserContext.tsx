import { createContext, Dispatch, SetStateAction, useEffect, useState } from "react";

interface Iuser{
    name: any;
    isLoggedIn: boolean;
}

const UserContext = createContext<any>({});

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(()=>{
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : {name: null, isLoggedIn: false};
  });

  // useEffect(() => {
  //   const value = localStorage.getItem("user");
  //   console.log(value);
  //   if (value === null) {
  //     localStorage.setItem("user", JSON.stringify(user));
  //   } else {
  //     setUser(JSON.parse(value));
  //   }
  // }, []);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  
  return (
    <UserContext.Provider
      value={{ user: user, setUser: setUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
