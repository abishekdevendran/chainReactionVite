import { BsFillCircleFill } from "react-icons/bs";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const Square = ({ value=0, color="red", index , clickHandler, lastMoveSquare }) => {
  const squareRef=useRef<HTMLDivElement | null>(null);
  return (
    <motion.div
      ref={squareRef}
      className={`h-5/6 w-5/6 flex text-center items-center justify-around cursor-pointer bg-slate-300 m-1 rounded-md text-2xl sm:text-3xl lg:text-4xl xl:text-5xl shadow-lg drop-shadow-lg ${
        lastMoveSquare && "outline-dashed outline-2"
      }`}
      onClick={(e) => clickHandler(e, index.x, index.y)}
      style={{ outlineColor: lastMoveSquare ? lastMoveSquare : color }}
      whileHover={{ scale: 1.1 }}
    >
      <BsFillCircleFill color={color} size={50}/>
      <div className="absolute text-white select-none">
        {value === 0 ? "" : value}
      </div>
    </motion.div>
  );
};

export default Square;
