import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWeather, fetchForecast, clearWeather } from './redux/weatherSlice';
import { db } from './firebase';
import { collection, addDoc, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import './App.css';

// Component Imports
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import RecentSearches from './components/RecentSearches';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import ErrorMessage from './components/ErrorMessage';
import LoadingSpinner from './components/LoadingSpinner';
import WeatherScene from './components/WeatherScene';

function App() {
  const [city, setCity] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  
  const dispatch = useDispatch(); 
  const { data, forecast, loading, error } = useSelector((state) => state.weather);

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
        dispatch(fetchForecast(city));
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

  const handleRecentSearch = (searchCity) => {
    dispatch(fetchWeather(searchCity));
    dispatch(fetchForecast(searchCity));
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

  return (
    <div className={`relative min-h-screen text-white transition-colors duration-1000 ease-in-out flex flex-col items-center justify-center p-6 font-sans ${getWeatherBackground(data?.weather[0]?.main)}`}>
      
      {/* 3D Weather Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <WeatherScene weatherCondition={data?.weather[0]?.main} />
        </Canvas>
      </div>

      <motion.div 
        layout
        className="relative z-10 w-full bg-black/20 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/10"
      >
        {/* Header / Search Section */}
        <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-center border-b border-white/5 gap-4">
          <Header />

          <div className="w-full md:w-auto flex flex-col gap-3">
            <SearchBar city={city} setCity={setCity} handleSearch={handleSearch} />
            <RecentSearches searches={recentSearches} onSearch={handleRecentSearch} />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="p-8 md:p-12 min-h-[400px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {error && <ErrorMessage message={error} />}

            {loading && <LoadingSpinner />}

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
                className="w-full"
              >
                <CurrentWeather data={data} />
                <Forecast forecast={forecast} />
                  
                <div className="mt-8 flex justify-center md:justify-end">
                  <button 
                    onClick={handleClear} 
                    className="text-xs text-white/40 hover:text-white transition-colors uppercase tracking-widest"
                  >
                    Reset View
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

export default App;
