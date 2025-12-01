import React from 'react';

const RecentSearches = ({ searches, onSearch }) => {
  if (!searches || searches.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 justify-center md:justify-end">
      {searches.map((search, i) => (
        <button 
          key={i} 
          onClick={() => onSearch(search)}
          className="text-[10px] uppercase tracking-wider text-white/60 hover:text-white transition-colors"
        >
          {search}
        </button>
      ))}
    </div>
  );
};

export default RecentSearches;
