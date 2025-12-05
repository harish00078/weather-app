import React, { useState, useEffect } from 'react';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);
  const toggle = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };
  return (
    <button 
      onClick={toggle} 
      className="fixed top-6 right-6 p-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-lg text-slate-800 dark:text-yellow-300 z-50 hover:bg-white/30 transition-all hover:scale-110 active:scale-95"
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  );
};

export default ThemeToggle;