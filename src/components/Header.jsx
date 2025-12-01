import React from 'react';

const Header = () => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-semibold tracking-tight">Weather</h1>
      <p className="text-sm text-white/60 font-light">{currentDate}</p>
    </div>
  );
};

export default Header;
