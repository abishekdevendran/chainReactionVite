import React, { useContext, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import UserContext from "../contexts/UserContext";
import { motion } from "framer-motion";

interface IState{
  from:string;
}

const Login = () => {
  const state=useLocation().state as IState;
  const [data, setData] = useState("");
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const submitHandler = (e) => {
    e.preventDefault();
    if (data.length <= 2) {
      toast.error("Usernames must contain minimum 3 letters");
      return;
    }
    setUser({
      uname: data,
      isLoggedIn: true,
    });
    console.log(state);
    if(state){
      navigate(-1);
    }
  };
  return (
    <motion.div
      className="min-h-screen flex items-center justify-center h-screen"
      initial={{ x: "-100vw" }}
      animate={{ x: 0 }}
      exit={{ scale: 0.5, opacity: 0 }}
    >
      <form onSubmit={submitHandler}>
        <label>Username:</label>
        <input
          required
          type="text"
          name="username"
          placeholder="Username"
          onChange={(e) => setData(e.target.value)}
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          type="submit"
        >
          Login
        </button>
      </form>
    </motion.div>
  );
};

export default Login;
