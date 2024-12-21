import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useContext, useState } from 'react';
import { textResources } from './utils/data'
import { LanguageContext } from './utils/globalStates'
// import { ToastContainer, toast } from 'react-toastify';

import LoginPage from './pages/LoginPage/loginPage';
import Dashboard from './pages/Dashboard/dashboard';
import NotFoundPage from './pages/notFoundPage/notFoundPage';
import ErrorPage from './pages/errorPage/errorPage';

import ReportingProduction from './pages/reportingProduction/reportingProduction'
import ReportingStorage from './pages/reportingStorage/reportingStorage'
import ReportingPacking from './pages/reportingPacking/reportingPacking'

import Settings from './pages/settings/settings'
import Manager from './pages/Manager/manager'

// import ErrorPage from './components/errorPage';
// import 'react-toastify/dist/ReactToastify.css';


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
    {/* <ToastContainer /> */}
    </LanguageContext.Provider>
    
  );
}

export default App;

