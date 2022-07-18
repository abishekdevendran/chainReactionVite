import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  RefObject,
} from "react";
import toast from "react-hot-toast";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { FiSun, FiMoon } from "react-icons/fi";
import { Link, NavLink, useNavigate } from "react-router-dom";
import DarkModeContext from "../contexts/DarkModeContext";
import UserContext from "../contexts/UserContext";
import { motion } from "framer-motion";

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const [mainNav, setMainNav] = useState(true);
  const { user, setUser } = useContext(UserContext);
  const { darkMode, setDarkMode } = useContext(DarkModeContext);
  const navItem = useRef<any>(null);
  const navigate = useNavigate();

  const logoutHandler = async () => {
    setUser({ name: null, isLoggedIn: false, sessionId: null, loginCount: 0 });
    navigate("/");
  };

  useEffect(() => {
    let mouseUpHandler = (e) => {
      if (!navItem.current?.contains(e.target) && nav) {
        setNav(false);
      }
    };

    document.addEventListener("mouseup", mouseUpHandler);

    return () => {
      document.removeEventListener("mouseup", mouseUpHandler);
    };
  }, [nav, navItem]);

  return (
    <div
      className={`bar max-h-20 w-full max-w-full fixed flex justify-center bg-bg-primary shadow-brand-primary shadow-2xl z-10 select-none bg-clip-padding bg-opacity-60 transition-all ease-in-ease-out duration-300 ${
        mainNav ? "top-0" : "-top-24"
      }`}
    >
      <div className="container flex justify-between items-center font-poppins text-primary py-4 px-4 max-w-screen-lg transition-all ease-in-ease-out duration-1000 text-ellipsis">
        <h1
          className={`pb-2 text-4xl sm:text-5xl font-semibold ${
            user.isLoggedIn ? "cursor-default" : "cursor-pointer"
          } whitespace-nowrap  ${
            darkMode
              ? "bg-gradient-to-r from-pink-500 to-violet-500"
              : "bg-gradient-to-r from-indigo-300 to-purple-400"
          }  bg-clip-text text-transparent transition-all ease-in-ease-out duration-1000`}
        >
          {user.isLoggedIn ? (
            <NavLink to="/game">Chain Reaction</NavLink>
          ) : (
            <NavLink to="/">Chain Reaction</NavLink>
          )}
        </h1>
        <div className="right flex">
          {!user.isLoggedIn ? (
            <ul className="hidden sm:flex">
              <li className="p-2 hover:opacity-80 cursor-pointer">
                <NavLink to="login" state={{ from: true }}>
                  Login
                </NavLink>
              </li>
            </ul>
          ) : (
            <ul className="hidden sm:flex sm:items-center sm:text-right">
              <li className="p-2 cursor-default font-semibold">{`Welcome, ${user.uname}`}</li>
              <li className="p-2 hover:opacity-80 cursor-pointer">
                {user.loginCount}
              </li>
              <li
                className="p-2 hover:opacity-80 cursor-pointer"
                onClick={logoutHandler}
              >
                Logout
              </li>
            </ul>
          )}
          <div className=" cursor-pointer sm:hidden text-primary">
            {!nav ? (
              <div className="animate-pulse">
                <AiOutlineMenu size={30} onClick={() => setNav(!nav)} />
              </div>
            ) : (
              <AiOutlineClose size={30} onClick={() => setNav(!nav)} />
            )}
            {!user.isLoggedIn ? (
              <ul
                ref={navItem}
                className={`fixed sm:hidden top-0 left-0 border-r-2 border-brand-primary bg-bg-primary text-primary h-full w-3/4 flex justify-center flex-col ease-in-out duration-300 cursor-default ${
                  nav ? "left-0" : "-left-full"
                }`}
              >
                <li className="p-8 py-8 text-3xl hover:text-brand-secondary cursor-pointer border-t-2 border-brand-primary text-right w-full">
                  <NavLink
                    to="login"
                    onClick={() => setNav(false)}
                    state={{ from: true }}
                  >
                    Login
                  </NavLink>
                </li>
              </ul>
            ) : (
              <ul
                ref={navItem}
                className={`fixed sm:hidden top-0 left-0 border-r-2 border-brand-primary bg-secondary text-primary h-full w-3/4 flex justify-center flex-col ease-in-out duration-300 cursor-default ${
                  nav ? "left-0" : "-left-full"
                }`}
              >
                <li className="p-8 py-8 text-3xl hover:text-brand-secondary cursor-pointer border-t-2 border-brand-primary text-right w-full font-semibold">
                  {`Welcome, ${user.name}`}
                </li>
                <li className="p-8 py-8 text-3xl hover:text-brand-secondary cursor-pointer border-t-2 border-brand-primary text-right w-full">
                  Profile
                </li>
                <li
                  className="p-8 py-8 text-3xl hover:text-brand-secondary cursor-pointer border-b-2 border-t-2 border-brand-primary text-right w-full"
                  onClick={() => {
                    logoutHandler();
                    setNav(false);
                  }}
                >
                  Logout
                </li>
              </ul>
            )}
          </div>
          {darkMode ? (
            <FiMoon
              size={30}
              onClick={() => {
                setDarkMode(!darkMode);
                toast("Dark Mode is now ON");
              }}
              className="ml-3 cursor-pointer sm:mt-1"
            />
          ) : (
            <motion.div
              className="m-3 cursor-pointer sm:mt-3"
              initial={{
                rotate: 0,
              }}
              whileHover={{
                rotate: 90,
                scale: 1.1,
              }}
              animate={{
                rotate: 0,
              }}
            >
              <FiSun
                size={30}
                onClick={() => {
                  setDarkMode(!darkMode);
                  toast("Dark Mode is now OFF");
                }}
              />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
