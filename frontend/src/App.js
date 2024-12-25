import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useContext, useState } from 'react';
import { textResources } from './utils/data'
import { LanguageContext } from './utils/globalStates'
import { ToastContainer, Zoom } from 'react-toastify'; // Import Toastify components
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify styles

import LoginPage from './pages/LoginPage/loginPage';
import Dashboard from './pages/Dashboard/dashboard';
import NotFoundPage from './pages/notFoundPage/notFoundPage';
import ErrorPage from './pages/errorPage/errorPage';

import ReportingProduction from './pages/reportingProduction/reportingProduction'
import ReportingStorage from './pages/reportingStorage/reportingStorage'
import ReportingPacking from './pages/reportingPacking/reportingPacking'

import Settings from './pages/settings/settings'
import Manager from './pages/Manager/manager'

function App() {

  const [language, setLanguage] = useState(localStorage.getItem('language') || 'he');

  const contextValue = {
    language,
    direction: textResources[language].direction,
    text: textResources[language] || textResources['he'],
    setLanguage: (lang) => {
      localStorage.setItem('language', lang);
      setLanguage(lang);
  },
};

  return (
    <LanguageContext.Provider value={contextValue}>
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage/>} />
        <Route path="/dashboard" element={<Dashboard isQueue={false} />} />
        <Route path="/settings" element={<Settings/>} />
        <Route path="/queue" element={<Dashboard isQueue={true} />} />
        <Route path="/ReportingStorage" element={<ReportingStorage />} />
        <Route path="/ReportingProduction" element={<ReportingProduction />} />
        <Route path="/ReportingPacking" element={<ReportingPacking />} />
        <Route path="/Manager" element={<Manager />} />
        <Route path="/error" element={<ErrorPage/>} />
        <Route path="*" element={<NotFoundPage />} />
        {/*
        */}
      </Routes>
    </Router>

      {/* ToastContainer to display toast messages */}
      <ToastContainer 
        position="top-center" // Default position
        autoClose={3000}      // Default auto-close duration in milliseconds
        hideProgressBar={true} // Hide progress bar
        newestOnTop={true}    // Show the newest toast on top
        closeOnClick={true}   // Close the toast when clicked
        transition={Zoom}
        closeButton={false}
        icon={false}
      />
    </LanguageContext.Provider>
    
  );
}

export default App;

