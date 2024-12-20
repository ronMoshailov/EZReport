import React, {useEffect, useContext} from 'react';
import './errorPage.scss';
import { useNavigate } from 'react-router-dom';

import { LanguageContext } from '../../utils/globalStates';

const ErrorPage = () => {
  const navigate = useNavigate();

  const { text } = useContext(LanguageContext);
  
  useEffect(() => {
    localStorage.clear();
  }, []);
  
  return (
    <div className="error-page-container">
      <div className="error-box">
        <h1>{text.error}</h1>
        <p>{text.errorPageMessage}</p>
        <button className="reconnect-button" onClick={() => navigate('/')}>
          {text.loginBack}
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
