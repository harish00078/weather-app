import React from 'react';
import { X } from 'lucide-react';

const ErrorMessage = ({ message }) => {
  if (!message) return null;
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 p-4 rounded-2xl mb-6 text-center text-sm font-medium flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-4 shadow-sm">
      <X className="w-4 h-4" /> {message}
    </div>
  );
};

export default ErrorMessage;