import React from 'react';
import { Clock } from 'lucide-react';

const RecentSearches = ({ searches, onSearch }) => {
  if (!searches.length) return null;
  return (
    <div className="mb-8 px-2">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recent Locations</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {searches.map((search, index) => (
          <button 
            key={index} 
            onClick={() => onSearch(search)}
            className="text-xs font-medium bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 py-1.5 px-3 rounded-lg border border-slate-200/50 dark:border-slate-700 transition-all hover:shadow-sm active:scale-95"
          >
            {search}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RecentSearches;