import React from 'react';
import { motion } from 'framer-motion';

const Forecast = ({ forecast }) => {
  if (!forecast || forecast.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="w-full border-t border-white/10 pt-8"
    >
      <h3 className="text-sm font-semibold uppercase tracking-widest text-white/60 mb-6">5-Day Forecast</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {forecast.map((day, index) => {
            const date = new Date(day.dt * 1000);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            return (
              <div key={index} className="bg-white/5 p-4 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center hover:bg-white/10 transition-colors">
                <p className="text-sm font-medium text-white/60 mb-2">{dayName}</p>
                <img 
                  src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`} 
                  alt={day.weather[0].description} 
                  className="w-10 h-10 mb-2 opacity-80"
                />
                <p className="text-lg font-bold">{Math.round(day.main.temp)}°</p>
                <p className="text-xs text-white/40 capitalize">{day.weather[0].main}</p>
              </div>
            );
        })}
      </div>
    </motion.div>
  );
};

export default Forecast;
