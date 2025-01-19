// Import React libraries, Context, Toast
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  // Import routing components for navigating between pages in a React application
import React from 'react';                                    // Import React and useState for managing component states
import { ToastContainer, Zoom } from 'react-toastify';                      // Import Toastify components for showing toast notifications
import 'react-toastify/dist/ReactToastify.css';                             // Import Toastify default styles to apply the toast notification styling

// Import main pages
import LoginPage from './pages/LoginPage/loginPage';
import Dashboard from './pages/Dashboard/dashboard';
import NotFoundPage from './pages/notFoundPage/notFoundPage';
import ErrorPage from './pages/errorPage/errorPage';
import Settings from './pages/settings/settings'
import Manager from './pages/Manager/manager'

// Import reporting pages
import ReportingProduction from './pages/reportingProduction/reportingProduction'
import ReportingStorage from './pages/reportingStorage/reportingStorage'
import ReportingPacking from './pages/reportingPacking/reportingPacking'

// Language Provider
import { LanguageProvider } from './utils/languageProvider'
// App
function App() {

  // Render
  return (
    <LanguageProvider>
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
      <ToastContainer 
        position="top-center"   // Default position
        autoClose={3000}        // Default auto-close duration in milliseconds
        hideProgressBar={true}  // Hide progress bar
        newestOnTop={true}      // Show the newest toast on top
        closeOnClick={true}     // Close the toast when clicked
        transition={Zoom}       // Make it zoom style
        closeButton={false}     // Remove the close button
        icon={false}            // Remove the icon
      />
    </LanguageProvider>
    
  );
}

// Export component
export default App;
