import React from 'react';
import { Search, Loader2 } from 'lucide-react';

const SearchBar = ({ city, setCity, handleSearch, loading }) => (
  <form onSubmit={handleSearch} className="relative mb-8 group">
    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
    <div className="relative flex items-center">
      <Search className="absolute left-4 text-slate-400 w-5 h-5" />
      <input
        type="text"
        placeholder="Search city..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="w-full pl-12 pr-4 py-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700 rounded-2xl text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-sm font-medium"
      />
      <button 
        type="submit" 
        disabled={loading || !city.trim()}
        className="absolute right-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-blue-500/25"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Go"}
      </button>
    </div>
  </form>
);

export default SearchBar;