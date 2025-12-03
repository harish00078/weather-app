import React, { useState, useEffect, Suspense } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { fetchWeather, fetchForecast, clearWeather } from './redux/weatherSlice';
import { db } from './firebase';
import { collection, addDoc, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { Canvas } from '@react-three/fiber';
import { Search, Loader2, Droplets, Wind, X, Clock } from 'lucide-react';

// Import 3D Scene
import WeatherScene from './components/WeatherScene';

// --- Helper: Determine Time of Day for Lighting ---
const getLightingProps = () => {
  const hour = new Date().getHours();
  const isNight = hour < 6 || hour > 18;

  return {
    ambientIntensity: isNight ? 0.3 : 0.8,
    directionalIntensity: isNight ? 0.8 : 1.5,
    directionalPosition: isNight ? [5, 5, -5] : [0, 10, 5], 
    fogColor: isNight ? '#020617' : '#2563eb', 
    fogDensity: isNight ? 0.02 : 0.005
  };
};

// --- Components ---

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);
  const toggle = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };
  return (
    <button 
      onClick={toggle} 
      className="fixed top-6 right-6 p-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-lg text-slate-800 dark:text-yellow-300 z-50 hover:bg-white/30 transition-all hover:scale-110 active:scale-95"
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  );
};

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

const CurrentWeatherCard = ({ data }) => (
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

const ForecastCard = ({ day }) => {
  const date = new Date(day.dt_txt);
  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
  
  return (
    <div className="flex flex-col items-center p-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg rounded-2xl border border-white/40 dark:border-slate-600 shadow-sm hover:shadow-lg hover:bg-white/80 dark:hover:bg-slate-700/80 transition-all duration-300 group cursor-default transform hover:-translate-y-1">
      <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">{dayName}</p>
      <div className="relative w-12 h-12 flex items-center justify-center">
        <div className="absolute inset-0 bg-blue-400/20 blur-lg rounded-full scale-0 group-hover:scale-100 transition-transform duration-500"></div>
        <img 
          src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`} 
          alt="icon" 
          className="w-10 h-10 relative z-10 drop-shadow-sm" 
        />
      </div>
      <p className="text-lg font-bold text-slate-800 dark:text-white mt-1">{Math.round(day.main.temp)}°</p>
    </div>
  );
};

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

function App() {
  const [city, setCity] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const lighting = getLightingProps(); 
  
  const dispatch = useDispatch(); 
  const { data, forecast, loading, error } = useSelector((state) => state.weather);

  useEffect(() => {
    const q = query(collection(db, "history"), orderBy("timestamp", "desc"), limit(4));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setRecentSearches(snapshot.docs.map(doc => doc.data().city));
    });
    return () => unsubscribe();
  }, []);

  const performSearch = async (cityName) => {
    if (cityName.trim()) {
      const weatherResult = await dispatch(fetchWeather(cityName));
      dispatch(fetchForecast(cityName));

      if (fetchWeather.fulfilled.match(weatherResult)) {
        try {
           await addDoc(collection(db, "history"), {
            city: cityName,
            timestamp: new Date()
          });
        } catch(err) { console.error("DB Error", err); }
        setCity('');
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    performSearch(city);
  };

  const handleClear = () => {
    dispatch(clearWeather());
    setCity('');
  };

  return (
    <div className="relative min-h-screen w-full font-sans overflow-hidden text-slate-900 dark:text-white transition-colors duration-500 bg-slate-50 dark:bg-slate-950">
      
      <div className="fixed inset-0 z-0 h-screen w-screen">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500 to-blue-700 dark:from-slate-950 dark:to-black pointer-events-none z-[-10]"></div>
        
        <Canvas 
          camera={{ position: [0, 0, 6], fov: 45 }}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}
        >
          <fog attach="fog" args={[lighting.fogColor, 5, 25]} />
          <ambientLight intensity={lighting.ambientIntensity} />
          <directionalLight position={lighting.directionalPosition} intensity={lighting.directionalIntensity} />
          
          <Suspense fallback={null}>
            <WeatherScene weatherCondition={data?.weather[0]?.main} />
          </Suspense>
        </Canvas>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 md:p-8 pointer-events-none">
        <ThemeToggle />
        
        <div className="pointer-events-auto w-full max-w-5xl">
          
          <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-1.5 rounded-[2.5rem] border border-white/20 dark:border-white/10 shadow-2xl ring-1 ring-black/5 transition-all duration-500">
            <div className="bg-white/60 dark:bg-slate-900/60 rounded-[2.2rem] p-6 md:p-8 h-full backdrop-blur-md">
              
              <div className="text-center mb-8 mt-2">
                <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight font-sans">
                  Weather<span className="text-blue-600 font-light">Sense</span>
                  <span className="text-blue-600 text-3xl leading-none">.</span>
                </h1>
              </div>

              <SearchBar 
                city={city} 
                setCity={setCity} 
                handleSearch={handleSearch} 
                loading={loading}
              />

              <RecentSearches 
                searches={recentSearches} 
                onSearch={performSearch} 
              />

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 p-4 rounded-2xl mb-6 text-center text-sm font-medium flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-4 shadow-sm">
                  <X className="w-4 h-4" /> {error}
                </div>
              )}

              {!data && !loading && !error && (
                <div className="text-center py-12 opacity-40">
                  <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Search className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                  </div>
                  <p className="text-sm font-medium">Start by searching for a city above.</p>
                </div>
              )}

              {data && !loading && (
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <CurrentWeatherCard data={data} />
                    
                    {forecast.length > 0 && (
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
                    )}
                  </div>

                  <button 
                    onClick={handleClear} 
                    className="mt-8 w-full py-3 text-sm font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-xl transition-colors"
                  >
                    Clear Results
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <p className="text-center text-xs text-slate-400/80 dark:text-slate-600 mt-6 font-medium">
            Powered by OpenWeather & Three.js
          </p>

        </div>
      </div>
    </div>
  );
}

export default App;