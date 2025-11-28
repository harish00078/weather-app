import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- FILE CONTENTS START ---

const cssContent = `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  background-color: #0f172a; /* dark slate bg */
}`;

const firebaseContent = `import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: REPLACE WITH YOUR ACTUAL FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);`;

const weatherSliceContent = `import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_KEY = "YOUR_OPENWEATHER_API_KEY"; // TODO: REPLACE THIS
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

export const fetchWeather = createAsyncThunk(
  'weather/fetchWeather',
  async (city, { rejectWithValue }) => {
    try {
      const response = await axios.get(\`\${BASE_URL}?q=\${city}&appid=\${API_KEY}&units=metric\`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "City not found");
    }
  }
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState: { data: null, loading: false, error: null },
  reducers: {
    clearWeather: (state) => {
      state.data = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.data = null;
      });
  },
});

export const { clearWeather } = weatherSlice.actions;
export default weatherSlice.reducer;`;

const storeContent = `import { configureStore } from '@reduxjs/toolkit';
import weatherReducer from './weatherSlice';

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
  },
});`;

const mainContent = `import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);`;

const appContent = `import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWeather, clearWeather } from './redux/weatherSlice';
import { db } from './firebase';
import { collection, addDoc, query, orderBy, limit, onSnapshot } from 'firebase/firestore';

function App() {
  const [city, setCity] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  
  const dispatch = useDispatch(); 
  const { data, loading, error } = useSelector((state) => state.weather);

  useEffect(() => {
    // Real-time listener for Firebase History
    const q = query(collection(db, "history"), orderBy("timestamp", "desc"), limit(5));
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

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4 font-sans">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-slate-700">
        <h1 className="text-4xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
          Weather Check
        </h1>

        <form onSubmit={handleSearch} className="relative mb-8">
          <input
            type="text"
            placeholder="Enter city name..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full p-4 pl-5 pr-24 bg-slate-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner placeholder-slate-400"
          />
          <button type="submit" className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-500 text-white px-4 rounded-lg font-semibold">
            Search
          </button>
        </form>

        {recentSearches.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2 justify-center">
            {recentSearches.map((search, index) => (
              <button key={index} onClick={() => dispatch(fetchWeather(search))}
                className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 py-1 px-3 rounded-full border border-slate-600">
                {search}
              </button>
            ))}
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-xl mb-6 text-center backdrop-blur-sm">
            ⚠️ {error}
          </div>
        )}

        {loading && (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
          </div>
        )}

        {data && !loading && (
          <div className="text-center animate-fade-in-up">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 shadow-lg relative overflow-hidden">
              <h2 className="text-3xl font-bold tracking-wide">{data.name}, {data.sys.country}</h2>
              <div className="flex justify-center items-center my-4">
                <img src={\`http://openweathermap.org/img/wn/\${data.weather[0].icon}@4x.png\`} alt="icon" className="w-32 h-32" />
              </div>
              <p className="text-6xl font-bold mb-2">{Math.round(data.main.temp)}°</p>
              <p className="text-xl text-blue-100 capitalize font-medium mb-6">{data.weather[0].description}</p>
              <div className="grid grid-cols-2 gap-4 border-t border-white/20 pt-4">
                <div><p className="text-blue-200 text-sm">Humidity</p><p className="text-xl font-bold">{data.main.humidity}%</p></div>
                <div><p className="text-blue-200 text-sm">Wind</p><p className="text-xl font-bold">{data.wind.speed} m/s</p></div>
              </div>
            </div>
            <button onClick={handleClear} className="mt-6 text-slate-400 hover:text-white text-sm underline underline-offset-4">
              Clear Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
export default App;`;

const readmeContent = `# Weather App

## How to Run
1. Install dependencies: \`npm install\`
2. Add your Keys: Update \`src/firebase.js\` and \`src/redux/weatherSlice.js\`
3. Run: \`npm run dev\`
`;

// --- FILE CREATION LOGIC ---

const files = {
  'src/redux/weatherSlice.js': weatherSliceContent,
  'src/redux/store.js': storeContent,
  'src/firebase.js': firebaseContent,
  'src/App.jsx': appContent,
  'src/main.jsx': mainContent,
  'src/index.css': cssContent,
  'README.md': readmeContent
};

const createFiles = async () => {
  try {
    // Ensure redux directory exists
    const reduxDir = path.join(__dirname, 'src', 'redux');
    if (!fs.existsSync(reduxDir)) {
      fs.mkdirSync(reduxDir, { recursive: true });
    }

    // Write all files
    for (const [filePath, content] of Object.entries(files)) {
      const fullPath = path.join(__dirname, filePath);
      fs.writeFileSync(fullPath, content);
      console.log(` Created: \${filePath}`);
    }

    console.log("\\n🎉 Project generation complete! Don't forget to add your API Keys.");
  } catch (err) {
    console.error("Error creating files:", err);
  }
};

createFiles();