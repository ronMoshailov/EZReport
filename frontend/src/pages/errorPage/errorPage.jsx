// Import React libraries
import React, {useEffect, useContext} from 'react';
import { useNavigate } from 'react-router-dom';

// Import scss
import './errorPage.scss';

// import context
import { LanguageContext } from '../../utils/languageProvider';

// ErrorPage conponent
const ErrorPage = () => {

  // useNaviate
  const navigate = useNavigate();

  // use Context
  const { text } = useContext(LanguageContext);
  
  // useEffect for initialized component
  useEffect(() => {
    localStorage.clear();
  }, []);
  
  // Render
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

// Export component
export default ErrorPage;
