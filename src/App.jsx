import React, { useState, useEffect, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWeather, fetchForecast, clearWeather } from './redux/weatherSlice';
import { db } from './firebase';
import { collection, addDoc, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { Canvas } from '@react-three/fiber';
import { Search } from 'lucide-react';

// Import Components
import WeatherScene from './components/WeatherScene';
import ThemeToggle from './components/ThemeToggle';
import SearchBar from './components/SearchBar';
import RecentSearches from './components/RecentSearches';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import ErrorMessage from './components/ErrorMessage';

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

              <ErrorMessage message={error} />

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
                    <CurrentWeather data={data} />
                    <Forecast forecast={forecast} />
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