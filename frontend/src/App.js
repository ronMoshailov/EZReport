import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';

import LoginPage from './components/loginPage';
import Dashboard from './components/dashboard';
import ReportingProduction from './components/workspacePages/reportingProduction'
import ReportingStorage from './components/workspacePages/reportingStorage'
import ReportingPacking from './components/workspacePages/reportingPacking'
import ErrorPage from './components/errorPage';
import NotFoundPage from './components/notFoundPage';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage/>} />
        <Route path="/error" element={<ErrorPage/>} />
        <Route path="/dashboard" element={<Dashboard isQueue={false} />} />
        <Route path="/queue" element={<Dashboard isQueue={true} />} />
        <Route path="/ReportingStorage" element={<ReportingStorage />} />  {/* New Report Page */}
        <Route path="/ReportingProduction" element={<ReportingProduction />} />  {/* New Report Page */}
        <Route path="/ReportingPacking" element={<ReportingPacking />} />  {/* New Report Page */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
