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
      className="absolute min-w-full min-h-screen flex items-center justify-center h-screen font-poppins bg-brand-grey-secondary"
      initial={{ x: "-100vw", y: 0 }}
      animate={{ x: 0, y: 0 }}
      exit={{ x: "100vw", y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <form
        onSubmit={submitHandler}
        className="max-w-sm rounded overflow-hidden shadow-lg text-center w-5/6 bg-bg-secondary p-5 py-9"
      >
        <label>Username:</label>
        <input
          required
          type="text"
          name="username"
          placeholder="Username"
          onChange={(e) => setData(e.target.value)}
          className="bg-bg-secondary border-b-2 border-brand-tertiary focus:outline-none focus:border-brand-primary focus:border-brand-primary-lg py-2 px-4 rounded text-brand-primary-lg"
        />
        <motion.button
          className="bg-brand-primary text-brand-tertiary font-bold py-2 px-4 rounded mx-2"
          type="submit"
          whileHover={{ scale: 1.1 }}
        >
          Login
        </motion.button>
      </form>
    </motion.div>
  );
};

export default Login;
