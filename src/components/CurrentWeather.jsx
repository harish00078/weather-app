import React from 'react';
import DetailBox from './DetailBox';

const CurrentWeather = ({ data }) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-10">
      {/* Left: Main Temp & Info */}
      <div className="text-center md:text-left flex flex-col items-center md:items-start">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">{data.name}</h2>
        <div className="flex items-start">
          <span className="text-8xl md:text-9xl font-thin tracking-tighter">
            {Math.round(data.main.temp)}°
          </span>
        </div>
        <p className="text-xl md:text-2xl font-light capitalize text-white/80 mt-[-10px]">
          {data.weather[0].description}
        </p>
      </div>

      {/* Right: Details Grid */}
      <div className="flex-1 w-full max-w-sm">
        <div className="grid grid-cols-2 gap-4">
          <DetailBox label="Humidity" value={`${data.main.humidity}%`} />
          <DetailBox label="Wind" value={`${data.wind.speed} m/s`} />
          <DetailBox label="Visibility" value={`${(data.visibility / 1000).toFixed(1)} km`} />
          <DetailBox label="Pressure" value={`${data.main.pressure} hPa`} />
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
