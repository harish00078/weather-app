import React from 'react';

const Forecast = ({ forecast }) => {
  if (!forecast || forecast.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-widest bg-white/40 dark:bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm inline-block shadow-sm">5-Day Forecast</h3>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {forecast.map((day, idx) => (
           <div key={idx} className="flex items-center justify-between p-3 px-4 bg-white/40 dark:bg-slate-800/40 backdrop-blur-md rounded-2xl border border-white/30 dark:border-white/10 hover:bg-white/50 dark:hover:bg-slate-700/50 transition-all shadow-sm group">
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold w-12 text-slate-700 dark:text-slate-200">{new Date(day.dt_txt).toLocaleDateString('en-US', { weekday: 'short' })}</span>
                <div className="relative w-8 h-8 flex items-center justify-center">
                  <div className="absolute inset-0 bg-blue-400/30 blur-md rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                  <img src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`} className="w-8 h-8 relative z-10" alt="icon" />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xl font-bold text-slate-800 dark:text-white">{Math.round(day.main.temp)}°</span>
                <span className="text-xs text-slate-600 dark:text-slate-400 capitalize w-20 text-right font-medium">{day.weather[0].main}</span>
              </div>
           </div>
        ))}
      </div>
    </div>
  );
};

export default Forecast;