import React, { MouseEvent } from "react";
import { BsFillCircleFill } from "react-icons/bs";

const Square = ({ value=0, color="red", index , clickHandler }) => {
  return (
    <div className={`flex text-center items-center justify-around p-2 cursor-pointer bg-slate-300 border-2`} onClick={(e)=>clickHandler(e,index.x,index.y)}>
      <BsFillCircleFill size={70} color={color}/>
      <div className="absolute text-white text-7xl select-none">{value===0?"":value}</div>
    </div>
  );
};

export default Square;
