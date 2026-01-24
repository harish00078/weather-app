# WeatherSense 🌦️

> An immersive, 3D weather dashboard that brings the forecast to life.

**WeatherSense** is a modern Single Page Application (SPA) that goes beyond static data. It features a dynamic 3D background that visually replicates current weather conditions—such as falling rain, moving clouds, or a rotating sun—in real-time.

---

## ✨ Key Features

* **Immersive 3D Environment:** The background scene reacts to live weather data using **Three.js**. If it's raining outside, it rains on your screen.
* **Real-Time Weather Data:** accurate current conditions (Temperature, Humidity, Wind Speed) for any city worldwide via the OpenWeatherMap API.
* **5-Day Forecast:** A summarized daily forecast to help you plan your week.
* **Smart Lighting:** The 3D scene automatically adjusts its lighting and fog density based on the local time of day (Day/Night cycle).
* **Persistent History:** Your recent searches are saved to **Firebase Firestore**, allowing you to quickly revisit favorite locations.
* **Glassmorphism UI:** A sleek, responsive interface featuring frosted glass effects and a dark/light mode toggle.

---

## 🛠️ Technology Stack

* **Core:** [React 18](https://react.dev/) & [Vite](https://vitejs.dev/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/)
* **3D Graphics:** [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) & [Drei](https://github.com/pmndrs/drei)
* **Database:** [Firebase Firestore](https://firebase.google.com/)
* **Icons:** [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v16 or higher)
* npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/harish00078/weather-app](https://github.com/harish00078/weather-app)
    cd weathersense
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    Create a `.env` file in the root directory. You will need API keys from [OpenWeatherMap](https://openweathermap.org/) and [Firebase](https://firebase.google.com/).

    ```env
    # OpenWeatherMap API
    VITE_OPENWEATHER_API_KEY=your_openweather_api_key

    # Firebase Configuration
    VITE_FIREBASE_API_KEY=your_firebase_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    VITE_FIREBASE_APP_ID=your_app_id
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

---

## 📂 Project Structure

```text
src/
├── assets/           # Static images and icons
├── components/       # Reusable UI components
│   ├── CurrentWeather.jsx  # Primary weather display card
│   ├── Forecast.jsx        # 5-day forecast list
│   ├── WeatherScene.jsx    # 3D Canvas and logic
│   ├── SearchBar.jsx       # Input field for city search
│   └── ...
├── redux/            # Global state management
│   ├── store.js      # Redux store configuration
│   └── weatherSlice.js # Async thunks and weather reducers
├── firebase.js       # Firebase initialization
├── App.jsx           # Main layout and lighting logic
└── main.jsx          # Application entry point