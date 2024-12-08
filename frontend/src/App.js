import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';

import LoginPage from './pages/LoginPage/loginPage';
import Dashboard from './pages/Dashboard/dashboard';
import NotFoundPage from './pages/errorPage/errorPage';

// import ReportingProduction from './components/workspacePages/reportingProduction'
// import ReportingStorage from './components/workspacePages/reportingStorage'
// import ReportingPacking from './components/workspacePages/reportingPacking'
// import ErrorPage from './components/errorPage';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage/>} />
        <Route path="/dashboard" element={<Dashboard isQueue={false} />} />
        <Route path="/queue" element={<Dashboard isQueue={true} />} />
        <Route path="*" element={<NotFoundPage />} />

        {/*
        <Route path="/error" element={<ErrorPage/>} />
        <Route path="/ReportingStorage" element={<ReportingStorage />} />
        <Route path="/ReportingProduction" element={<ReportingProduction />} />
        <Route path="/ReportingPacking" element={<ReportingPacking />} />
        */}
      </Routes>
    </Router>
  );
}

export default App;

