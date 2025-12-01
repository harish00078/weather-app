import React from 'react';
import { motion } from 'framer-motion';

const ErrorMessage = ({ message }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="text-center text-red-200 bg-red-500/10 p-4 rounded-xl border border-red-500/20"
    >
      {message}
    </motion.div>
  );
};

export default ErrorMessage;
