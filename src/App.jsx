import React, { useState, useEffect, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWeather, fetchForecast, clearWeather } from './redux/weatherSlice';
import { db } from './firebase';
import { collection, addDoc, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { Canvas } from '@react-three/fiber';

// Import 3D Scene
import WeatherScene from './components/WeatherScene';

// Import Modular UI Components
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import RecentSearches from './components/RecentSearches';
import ErrorMessage from './components/ErrorMessage';
import LoadingSpinner from './components/LoadingSpinner';

// Theme Toggle Component
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
    <button onClick={toggle} className="fixed top-4 right-4 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-md text-gray-600 dark:text-yellow-400 z-50 hover:bg-white dark:hover:bg-gray-700 transition-colors">
      {isDark ? '☀️' : '🌙'}
    </button>
  );
};

function App() {
  const [city, setCity] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  
  const dispatch = useDispatch(); 
  const { data, forecast, loading, error } = useSelector((state) => state.weather);

  // Firestore Real-time Listener
  useEffect(() => {
    const q = query(collection(db, "history"), orderBy("timestamp", "desc"), limit(5));
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
    <div className="relative min-h-screen w-full font-sans overflow-hidden text-slate-900 dark:text-white transition-colors duration-300">
      
      {/* 3D Background Layer */}
      {/* FIX: Added explicit h-screen, w-full, and fixed positioning to ensure it covers the background */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 h-screen w-screen">
        <Canvas 
          camera={{ position: [0, 0, 5], fov: 60 }}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        >
          <Suspense fallback={null}>
            <WeatherScene weatherCondition={data?.weather[0]?.main} />
          </Suspense>
        </Canvas>
      </div>

      {/* UI Layer */}
      {/* FIX: Added z-10 and relative to ensure it sits ON TOP of the canvas */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 pointer-events-none">
        {/* The container needs pointer-events-auto so buttons are clickable */}
        <div className="pointer-events-auto bg-white/90 dark:bg-slate-800/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-full max-w-lg border border-white/20 dark:border-slate-700 transition-colors duration-300">
          
          <ThemeToggle />

          <Header />

          <SearchBar 
            city={city} 
            setCity={setCity} 
            handleSearch={handleSearch} 
          />

          <RecentSearches 
            searches={recentSearches} 
            onSearch={performSearch} 
          />

          {error && <ErrorMessage message={error} />}

          {loading && <LoadingSpinner />}

          {data && !loading && (
            <div className="text-center animate-fade-in-up space-y-6">
              <CurrentWeather data={data} />
              <Forecast forecast={forecast} />
              
              <button 
                onClick={handleClear} 
                className="mt-6 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm underline underline-offset-4 transition-colors"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;