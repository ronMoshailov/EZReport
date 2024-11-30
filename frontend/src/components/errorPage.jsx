import React, {useEffect} from 'react';
import './errorPage.scss';
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.clear();
  }, []);
  
  return (
    <div className="error-page-container">
      <div className="error-box">
        <h1>שגיאה</h1>
        <p>אירעה שגיאה במערכת. אנא נסה להתחבר מחדש.</p>
        <button className="reconnect-button" onClick={() => navigate('/')}>
          התחבר מחדש
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
