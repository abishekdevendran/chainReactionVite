import React, { createContext, useEffect } from "react";
import {io,Socket} from "socket.io-client";
import toast from "react-hot-toast";

const SocketContext = createContext<any>({});

interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

interface ClientToServerEvents {
  hello: () => void;
}

export const SocketContextProvider = ({ children }) => {
//   const socket = useRef();
  const socket:Socket<ServerToClientEvents, ClientToServerEvents> = io("http://localhost:5000",{
    reconnection: true,
    closeOnBeforeunload: true,
  });
  useEffect(() => {
    socket.on("connect_error", (err) => {
      toast.error(`Server unavailable at the moment. ${err}`);
    });
    socket.on("disconnect", (err) => {
      toast.error(`Server disconnected unexpectedly. Error: ${err}`);
    });
    return () => {
      socket.off("connect_error");
      socket.off("disconnect");
    };
  }, []);
  return (
    <SocketContext.Provider value={{ socket: socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
