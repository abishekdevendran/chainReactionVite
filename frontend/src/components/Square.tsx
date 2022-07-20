import { BsFillCircleFill } from "react-icons/bs";
import { motion } from "framer-motion";

const Square = ({ value=0, color="red", index , clickHandler, lastMoveSquare }) => {
  return (
    <motion.div className={`h-5/6 w-5/6 flex text-center items-center justify-around p-2 cursor-pointer bg-slate-300 m-1 rounded-md text-2xl sm:text-3xl lg:text-4xl xl:text-5xl ${lastMoveSquare&&"outline-dashed outline-2"}`} onClick={(e)=>clickHandler(e,index.x,index.y)}
    style={{outlineColor:lastMoveSquare?lastMoveSquare:color}}
    whileHover={{scale:1.1}}>
      <BsFillCircleFill color={color}/>
      <div className="absolute text-white select-none">{value===0?"":value}</div>
    </motion.div>
  );
};

export default Square;
