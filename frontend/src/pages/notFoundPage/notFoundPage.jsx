import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './notFoundPage.scss'; 

import { LanguageContext } from '../../utils/globalStates';

const NotFoundPage = () => {
  const navigate = useNavigate();

  const { text } = useContext(LanguageContext);
  
  const handleGoHome = () => {
    navigate('/'); 
  };

  useEffect(() => {
    localStorage.clear();
  }, []);

  return (
    <div className="not-found-page">
      <h1>{text.pageNotFound404}</h1>
      <p>{text.pageNotFoundOps}</p>
      <button onClick={handleGoHome}>{text.returnMainPage}</button>
    </div>
  );
};

export default NotFoundPage;
