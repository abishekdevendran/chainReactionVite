import React from "react";
import { motion } from "framer-motion";
import { resolveValue } from "react-hot-toast";

const MotionToast = ({ t }) => {
  return (
    <motion.div
      className="bg-bg-secondary text-primary p-3 rounded-3xl ease-in-out transition-colors"
      initial={{ y: "-100%" }}
      animate={{ y: t.visible ? "0%" : "-200%", opacity: t.visible ? 1 : 0 }}
      exit={{ opacity: 0, y: "-200%" }}
    >
      {resolveValue(t.message, t)}
    </motion.div>
  );
};

export default MotionToast;
