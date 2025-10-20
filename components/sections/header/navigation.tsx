import { motion } from "framer-motion";

export const EASE_CUSTOM = [0.76, 0, 0.24, 1] as const;
export const ENTER_DURATION = 0.25;
export const EXIT_DURATION = 0.2;
const initial = {
  display: "hidden",
  background: "transparent",
  padding: "0px",
  opacity: 0,
};

const height = {
  initial,
  enter: {
    display: "block",
    background: "black",
    opacity: 100,
    padding: "16px",
    transition: {
      duration: ENTER_DURATION,
      ease: EASE_CUSTOM,
    },
  },
  exit: {
    ...initial,
    transition: {
      duration: EXIT_DURATION,
      ease: EASE_CUSTOM,
    },
  },
};

const Navigation = () => {
  return (
    <motion.div
      variants={height}
      initial="initial"
      animate="enter"
      exit="exit"
      className="overflow-hidden top-0 left-0 fixed z-40 h-screen w-screen"
    >
      <div className="bg-white h-full p-12 flex rounded-3xl">hi</div>
    </motion.div>
  );
};

export default Navigation;
