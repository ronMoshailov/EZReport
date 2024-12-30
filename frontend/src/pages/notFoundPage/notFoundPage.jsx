// Import React libraries
import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// Import scss
import './notFoundPage.scss'; 

// Import context
import { LanguageContext } from '../../utils/languageProvider';

// NotFoundPage component
const NotFoundPage = () => {

  // useNavigate
  const navigate = useNavigate();

  // useContext
  const { text } = useContext(LanguageContext);

  // useEffect for initialized component
  useEffect(() => {
    localStorage.clear();
  }, []);

  // Render
  return (
    <div className="not-found-container">
      <div className="not-found-page">
        <h1>{text.pageNotFound404}</h1>
        <p>{text.pageNotFoundOps}</p>
        <button onClick={() => {navigate('/')}}>{text.returnMainPage}</button>
      </div>
    </div>
  );
};

// Export component
export default NotFoundPage;
