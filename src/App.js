import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import EventPage from './pages/EventPage';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      <Router>
        <div className="p-4 bg-white dark:bg-gray-900 dark:text-white min-h-screen">
          <header className="flex justify-between items-center">
            <h1 href={`/`} className="text-xl">Event Planner</h1>
            <button
              onClick={toggleDarkMode}
              className="px-4 py-2 bg-gray-800 text-white rounded dark:bg-gray-200 dark:text-gray-900"
            >
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
          </header>

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/event/:slug" element={<EventPage />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;