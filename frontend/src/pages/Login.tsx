import React, { useContext, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import UserContext from "../contexts/UserContext";

const Login = () => {
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
    navigate("/game");
  };
  return (
    <div className="flex items-center justify-center h-screen">
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
    </div>
  );
};

export default Login;
