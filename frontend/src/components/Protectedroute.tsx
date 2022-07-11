import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom';
import UserContext from '../contexts/UserContext';

const Protectedroute = ({children}) => {
    const {user} = useContext(UserContext);
    if(user.isLoggedIn){
        return children;
    }
    else{
        return <Navigate to="/login" state={{ from: true }} />;
    }
}

export default Protectedroute