# Weather App with 3D Visualizations

A modern, immersive weather dashboard built with React. This application combines real-time weather data fetching, global state management, cloud persistence, and dynamic 3D visualizations to provide a unique user experience.

## 🚀 Features

- **Real-time Weather Data**: Fetches current weather and 5-day forecasts using the OpenWeather API.
- **Immersive 3D Backgrounds**: Dynamically renders 3D scenes (Sun, Rain, Clouds, Thunderstorm) based on the current weather condition using Three.js and React Three Fiber.
- **Search History**: Persists recent user searches to the cloud using Firebase Firestore, with real-time updates.
- **Global State Management**: Utilizes Redux Toolkit for efficient data flow and state handling across components.
- **Modern UI**: Styled with Tailwind CSS, featuring a responsive "glassmorphism" design with dark/light mode support.

## 🛠 Technology Stack

- **Frontend**: React (Vite)
- **State Management**: Redux Toolkit (`react-redux`, `@reduxjs/toolkit`)
- **3D Graphics**: Three.js, `@react-three/fiber`, `@react-three/drei`
- **Styling**: Tailwind CSS, `lucide-react` (icons)
- **Backend/DB**: Firebase (Firestore)
- **HTTP Client**: Axios

## ⚙️ Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd weather-app
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    Create a `.env` file in the root directory and add your API keys:
    ```env
    VITE_OPENWEATHER_API_KEY=your_openweather_api_key
    # Firebase Configuration (add your specific firebase config keys)
    VITE_FIREBASE_API_KEY=...
    VITE_FIREBASE_AUTH_DOMAIN=...
    VITE_FIREBASE_PROJECT_ID=...
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

## 📂 Project Structure

```
src/
├── assets/             # Static assets (images, SVGs)
├── components/         # Reusable UI and 3D components
│   ├── CurrentWeather.jsx  # Displays main temperature and condition
│   ├── Forecast.jsx        # 5-day forecast list
│   ├── WeatherScene.jsx    # Main 3D canvas logic
│   └── ...
├── redux/              # Global state management
│   ├── store.js            # Redux store configuration
│   └── weatherSlice.js     # Weather data slice (actions & reducers)
├── App.jsx             # Main application layout and logic
├── firebase.js         # Firebase initialization
└── main.jsx            # Entry point
```

## 🏗 Architecture

### State Management (Redux)
The application uses **Redux Toolkit** to manage the global state, specifically in `src/redux/weatherSlice.js`.
- **State Structure**: Holds `currentWeather`, `forecast`, `loading` status, `error` messages, and the current `unit` (metric/imperial).
- **Async Thunks**:
    - `fetchWeather`: Calls OpenWeather's `/weather` endpoint.
    - `fetchForecast`: Calls OpenWeather's `/forecast` endpoint and filters for daily views (noon data).

### 3D Visualization System
The 3D logic is encapsulated in `src/components/WeatherScene.jsx`.
- **Canvas**: The app uses `@react-three/fiber`'s `Canvas` as the background.
- **Dynamic Rendering**: The component receives the `weatherCondition` prop (e.g., "Clear", "Rain", "Clouds") and conditionally renders specific 3D meshes:
    - **Clear**: A rotating yellow icosahedron representing the Sun.
    - **Rain**: A particle system simulating falling rain.
    - **Thunderstorm**: Flashing lighting effects and dark cloud meshes.

### Data Persistence (Firebase)
Search history is stored in a **Firestore** collection named `searches`.
- **Real-time Sync**: `src/App.jsx` uses `onSnapshot` to listen for changes in the `searches` collection, ensuring the UI updates instantly when a new search is added from any device.

## 🧩 Key Components

| Component | Description |
| :--- | :--- |
| **App.jsx** | The root orchestrator. It manages the search input, dispatches Redux actions, and composes the layout over the 3D background. |
| **WeatherScene.jsx** | Contains the Three.js logic. It handles the lighting, camera, and specific weather meshes based on state. |
| **CurrentWeather.jsx** | A presentation component that displays the city name, temperature, and main weather icon. |
| **DetailBox.jsx** | Small cards for displaying extra metrics like Humidity, Wind Speed, and Pressure. |
| **ThemeToggle.jsx** | A button that toggles the `dark` class on the HTML root, enabling Tailwind's dark mode. |

## 🎨 Styling
The app uses **Tailwind CSS**.
- **Glassmorphism**: Achieved using utilities like `bg-white/30`, `backdrop-blur-md`, and `border-white/20`.
- **Responsive**: Grid and Flexbox layouts adapt to mobile (`grid-cols-1`) and desktop (`md:grid-cols-2`) screens.
