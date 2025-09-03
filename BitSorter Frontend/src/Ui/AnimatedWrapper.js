import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useSelector } from "react-redux";

const AnimatedWrapper = ({children, className = "" ,threshold = 0.1}) => {
 
  const isDark = useSelector((state)=>state?.isDark?.isDark);
  const { ref, inView } = useInView({ threshold:threshold, triggerOnce:true }); //when 30 % in view then trigger...

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50}}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedWrapper;
