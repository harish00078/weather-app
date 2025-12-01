import React from 'react';

const SearchBar = ({ city, setCity, handleSearch }) => {
  return (
    <form onSubmit={handleSearch} className="relative group w-full md:w-80">
      <input
        type="text"
        placeholder="Search city..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="w-full bg-white/10 border border-white/10 rounded-full py-2 px-5 pr-12 text-sm focus:outline-none focus:bg-white/20 transition-all placeholder-white/50"
      />
      <button 
        type="submit" 
        className="absolute right-1 top-1 bottom-1 bg-white/10 hover:bg-white/20 rounded-full px-3 text-xs font-medium transition-colors"
      >
        Go
      </button>
    </form>
  );
};

export default SearchBar;
