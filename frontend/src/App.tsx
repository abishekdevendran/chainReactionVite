import { useContext } from "react";
import { Navigate } from "react-router-dom";
import UserContext from "./contexts/UserContext";

function App() {
  const { user } = useContext(UserContext);
  if (user.isLoggedIn) {
    return <Navigate to="/game" replace />;
  } else {
    return (
      <div className="justify-center w-screen text-center select-none font-poppins">
        This is a very nice game uk.
      </div>
    );
  }
}

export default App;
