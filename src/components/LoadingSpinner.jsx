import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex justify-center items-center h-full"
    >
      <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
    </motion.div>
  );
};

export default LoadingSpinner;
