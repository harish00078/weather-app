import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define constants at the top level so they are available to all thunks
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

// Existing current weather thunk
export const fetchWeather = createAsyncThunk(
  'weather/fetchWeather',
  async (city, { rejectWithValue }) => {
    try {
      // Use the top-level constants
      const response = await axios.get(`${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "City not found");
    }
  }
);

// NEW: Async thunk to fetch 5-day forecast data
export const fetchForecast = createAsyncThunk(
  'weather/fetchForecast',
  async (city, { rejectWithValue }) => {
    try {
      // Use the top-level constants here as well
      const response = await axios.get(`${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`);
      
      // The API returns weather data every 3 hours.
      // We filter the list to pick one reading per day (e.g., at 12:00:00) to show a daily forecast.
      const dailyData = response.data.list.filter(reading => reading.dt_txt.includes("12:00:00"));
      
      return dailyData;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Forecast not found");
    }
  }
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState: { 
    data: null,       // Stores current weather data
    forecast: [],     // NEW: Stores the filtered 5-day forecast data
    loading: false, 
    error: null 
  },
  reducers: {
    clearWeather: (state) => {
      state.data = null;
      state.forecast = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Handling fetchWeather actions
    builder
      .addCase(fetchWeather.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        // Note: We keep loading true if you want to wait for forecast, or set false here if you want progressive loading
        state.data = action.payload;
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.data = null;
      });

    // Handling fetchForecast actions
    builder
      .addCase(fetchForecast.pending, (state) => {
        // Optional: You could set specific loading states for forecast if needed
      })
      .addCase(fetchForecast.fulfilled, (state, action) => {
        state.loading = false; // Data is ready
        state.forecast = action.payload;
      })
      .addCase(fetchForecast.rejected, (state, action) => {
        state.loading = false;
        console.error("Forecast error:", action.payload);
        // We choose not to clear the current weather if forecast fails, just log the error
      });
  },
});

export const { clearWeather } = weatherSlice.actions;
export default weatherSlice.reducer;