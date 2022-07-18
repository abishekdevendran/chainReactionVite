import React, { MouseEvent } from "react";
import { BsFillCircleFill } from "react-icons/bs";
import { motion } from "framer-motion";

const Square = ({ value=0, color="red", index , clickHandler }) => {
  return (
    <motion.div className={`flex text-center items-center justify-around p-2 cursor-pointer bg-slate-300 m-1 rounded-md`} onClick={(e)=>clickHandler(e,index.x,index.y)}
    whileHover={{scale:1.1}}>
      <BsFillCircleFill size={70} color={color}/>
      <div className="absolute text-white text-7xl select-none">{value===0?"":value}</div>
    </motion.div>
  );
};

export default Square;
