import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/loginPage';
import Dashboard from './components/dashboard';
import NewReportPage from './components/workspacePages/NewReportPage'
import NewStorageReport from './components/workspacePages/newStorageReport'
import React, { useState, useEffect } from 'react';

function App() {

  const [workspace, setWorkspace] = useState(() => {
    return localStorage.getItem('workspace') || '';
  });

  const [reportId, setReportId] = useState(() => {
    return localStorage.getItem('reportId') || '';
  });

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage workspace={workspace} setWorkspace={setWorkspace}/>} />
        <Route path="/dashboard" element={<Dashboard workspace={workspace} isQueue={false} />} />
        <Route path="/queue" element={<Dashboard workspace={workspace} isQueue={true} />} />
        <Route path="/new-report-page" element={<NewReportPage workspace={workspace}/>} />  {/* New Report Page */}
        <Route path="/newStorageReport" element={<NewStorageReport workspace={workspace}/>} />  {/* New Report Page */}
      </Routes>
    </Router>
  );
}

export default App;
