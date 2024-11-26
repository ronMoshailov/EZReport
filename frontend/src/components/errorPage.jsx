import React from 'react';
import './errorPage.scss';
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
  const navigate = useNavigate();

  const handleReconnect = () => {
    navigate('/'); // Redirects to the login page at '/'
  };

  return (
    <div className="error-page-container">
      <div className="error-box">
        <h1>שגיאה</h1>
        <p>אירעה שגיאה במערכת. אנא נסה להתחבר מחדש.</p>
        <button className="reconnect-button" onClick={handleReconnect}>
          התחבר מחדש
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
