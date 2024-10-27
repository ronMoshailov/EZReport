import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/loginPage';
import Dashboard from './components/dashboard';
import NewReportPage from './components/NewReportPage'
import NewStorageReport from './components/newStorageReport'
import React, { useState, useEffect } from 'react';

function App() {

  const [position, setPosition] = useState(() => {
    return localStorage.getItem('position') || '';
  });

  useEffect(() => {
    if (position) {
      localStorage.setItem('position', position);
    }
  }, [position]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage position={position} setPosition={setPosition}/>} />
        <Route path="/dashboard" element={<Dashboard position={position} isQueue={false} />} />
        <Route path="/queue" element={<Dashboard position={position} isQueue={true} />} />
        <Route path="/new-report-page" element={<NewReportPage position={position}/>} />  {/* New Report Page */}
        <Route path="/newStorageReport" element={<NewStorageReport position={position}/>} />  {/* New Report Page */}
      </Routes>
    </Router>
  );
}

export default App;
