import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWeather, clearWeather } from './redux/weatherSlice';
import { db } from './firebase';
import { collection, addDoc, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  
  const dispatch = useDispatch(); 
  const { data, loading, error } = useSelector((state) => state.weather);

  useEffect(() => {
    const q = query(collection(db, "history"), orderBy("timestamp", "desc"), limit(4));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setRecentSearches(snapshot.docs.map(doc => doc.data().city));
    });
    return () => unsubscribe();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (city.trim()) {
      const result = await dispatch(fetchWeather(city));
      if (fetchWeather.fulfilled.match(result)) {
        try {
          await addDoc(collection(db, "history"), {
            city: city,
            timestamp: new Date()
          });
        } catch(err) { console.error("DB Error", err); }
        setCity('');
      }
    }
  };

  const handleClear = () => {
    dispatch(clearWeather());
    setCity('');
  };

  // Dynamic Background Logic
  const getWeatherBackground = (condition) => {
    if (!condition) return "bg-gradient-to-br from-slate-900 to-slate-800";
    switch (condition.toLowerCase()) {
      case 'clear': return "bg-gradient-to-br from-sky-400 to-blue-600";
      case 'clouds': return "bg-gradient-to-br from-slate-400 to-slate-600";
      case 'rain': 
      case 'drizzle': return "bg-gradient-to-br from-slate-700 to-slate-900";
      case 'thunderstorm': return "bg-gradient-to-br from-indigo-900 to-slate-900";
      case 'snow': return "bg-gradient-to-br from-blue-100 to-blue-300";
      case 'mist':
      case 'fog': return "bg-gradient-to-br from-gray-300 to-gray-500";
      default: return "bg-gradient-to-br from-blue-500 to-blue-700";
    }
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className={`min-h-screen text-white transition-colors duration-1000 ease-in-out flex flex-col items-center justify-center p-6 font-sans ${getWeatherBackground(data?.weather[0]?.main)}`}>
      
      <motion.div 
        layout
        className="w-full max-w-4xl bg-black/20 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/10"
      >
        {/* Header / Search Section */}
        <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-center border-b border-white/5 gap-4">
          <div className="flex flex-col">
             <h1 className="text-2xl font-semibold tracking-tight">Weather</h1>
             <p className="text-sm text-white/60 font-light">{currentDate}</p>
          </div>

          <div className="w-full md:w-auto flex flex-col gap-3">
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
            
            {/* Minimal Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center md:justify-end">
                {recentSearches.map((search, i) => (
                  <button 
                    key={i} 
                    onClick={() => dispatch(fetchWeather(search))}
                    className="text-[10px] uppercase tracking-wider text-white/60 hover:text-white transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="p-8 md:p-12 min-h-[400px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center text-red-200 bg-red-500/10 p-4 rounded-xl border border-red-500/20"
              >
                {error}
              </motion.div>
            )}

            {loading && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center items-center h-full"
              >
                <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              </motion.div>
            )}

            {!data && !loading && !error && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="text-center text-white/40 font-light text-lg"
              >
                Enter a city to explore the forecast.
              </motion.div>
            )}

            {data && !loading && (
              <motion.div
                key="weather-data"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex flex-col md:flex-row items-center justify-between gap-12"
              >
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
                  
                  <div className="mt-8 flex justify-center md:justify-end">
                    <button 
                      onClick={handleClear} 
                      className="text-xs text-white/40 hover:text-white transition-colors uppercase tracking-widest"
                    >
                      Reset View
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

// Simple internal component for details
const DetailBox = ({ label, value }) => (
  <div className="bg-white/5 p-4 rounded-2xl border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
    <p className="text-xs text-white/50 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-xl font-medium">{value}</p>
  </div>
);

export default App;