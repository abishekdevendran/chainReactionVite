import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import UserContext from '../contexts/UserContext';

const Login = () => {
    const [data,setData] = useState("");
    const {setUser} = useContext(UserContext);
    const navigate=useNavigate();
    const submitHandler = (e) => {
        e.preventDefault();
        setUser({
            uname: data,
            isLoggedIn: true,
        });
        navigate("/game");
    }
  return (
    <div className='flex items-center justify-center h-screen'>Login
        <form onSubmit={submitHandler}>
            <label>Username:</label>
            <input type="text" name="username" placeholder="Username" onChange={(e)=>setData(e.target.value)}/>
        </form>
    </div>
  )
}

export default Login