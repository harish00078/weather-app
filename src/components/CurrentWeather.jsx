import React from 'react';
import { Droplets, Wind } from 'lucide-react';

const CurrentWeather = ({ data }) => (
  <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-500/80 to-indigo-600/80 text-white p-8 shadow-2xl mb-8 transform transition-all hover:scale-[1.01] backdrop-blur-md border border-white/20">
    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
    <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-black/10 rounded-full blur-2xl"></div>
    
    <div className="relative z-10 flex flex-col items-center">
      <h2 className="text-3xl font-bold tracking-tight mb-1">{data.name}, {data.sys.country}</h2>
      <p className="text-blue-100 text-sm font-medium mb-6 uppercase tracking-wide">{new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
      
      <div className="flex items-center justify-center gap-8 mb-8">
        <img 
          src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`} 
          alt="icon" 
          className="w-28 h-28 drop-shadow-2xl filter brightness-110 animate-pulse-slow" 
        />
        <div className="text-center">
           <span className="text-8xl font-extrabold tracking-tighter block leading-none drop-shadow-md">{Math.round(data.main.temp)}°</span>
           <span className="text-xl text-blue-50 font-medium capitalize mt-2 block">{data.weather[0].description}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 w-full bg-white/10 rounded-2xl p-4 backdrop-blur-md border border-white/10">
        <div className="flex items-center justify-center gap-3">
          <div className="p-2 bg-blue-400/30 rounded-full">
            <Droplets className="w-5 h-5 text-blue-50" />
          </div>
          <div className="text-left">
            <p className="text-[10px] text-blue-200 uppercase tracking-widest font-bold">Humidity</p>
            <p className="text-lg font-bold">{data.main.humidity}%</p>
          </div>
        </div>
        <div className="flex items-center justify-center gap-3 border-l border-white/10 pl-4">
          <div className="p-2 bg-blue-400/30 rounded-full">
            <Wind className="w-5 h-5 text-blue-50" />
          </div>
          <div className="text-left">
            <p className="text-[10px] text-blue-200 uppercase tracking-widest font-bold">Wind</p>
            <p className="text-lg font-bold">{Math.round(data.wind.speed)} <span className="text-sm font-medium text-blue-200">m/s</span></p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default CurrentWeather;