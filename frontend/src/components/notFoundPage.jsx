import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './notFoundPage.scss'; 

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/'); 
  };

  useEffect(() => {
    localStorage.clear();
  }, []);

  return (
    <div className="not-found-page">
      <h1>404 - דף לא קיים</h1>
      <p>אופס! הדף לא קיים.</p>
      <button onClick={handleGoHome}>חזרה לעמוד הראשי</button>
    </div>
  );
};

export default NotFoundPage;
