import React, { MouseEvent } from "react";
import { BsFillCircleFill } from "react-icons/bs";

const Square = ({ value=0, color="red", index , clickHandler }) => {
  return (
    <div className={`flex text-center items-center justify-around p-2 cursor-pointer`} style={{backgroundColor:`${color}`}} onClick={(e)=>clickHandler(e,index.x,index.y)}>
      <BsFillCircleFill size={70}/>
      <div className="absolute text-white text-7xl select-none">{value}</div>
    </div>
  );
};

export default Square;
