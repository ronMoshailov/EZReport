import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';
// import { ToastContainer, toast } from 'react-toastify';

import LoginPage from './pages/LoginPage/loginPage';
import Dashboard from './pages/Dashboard/dashboard';
import NotFoundPage from './pages/errorPage/errorPage';

import ReportingProduction from './pages/reportingProduction/reportingProduction'
import ReportingStorage from './pages/reportingStorage/reportingStorage'
import ReportingPacking from './pages/reportingPacking/reportingPacking'
// import ErrorPage from './components/errorPage';
// import 'react-toastify/dist/ReactToastify.css';


function App() {

  // const notify = () => {
  //   toast.success('This is a success message!'); // Other options include toast.error, toast.info, etc.
  // };

  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage/>} />
        <Route path="/dashboard" element={<Dashboard isQueue={false} />} />
        <Route path="/queue" element={<Dashboard isQueue={true} />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/ReportingStorage" element={<ReportingStorage />} />
        <Route path="/ReportingProduction" element={<ReportingProduction />} />
        <Route path="/ReportingPacking" element={<ReportingPacking />} />
        {/*
        <Route path="/error" element={<ErrorPage/>} />
        */}
      </Routes>
    </Router>
    {/* <ToastContainer /> */}
    </>
    
  );
}

export default App;

