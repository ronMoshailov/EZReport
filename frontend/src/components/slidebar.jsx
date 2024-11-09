import React from 'react';
import { Link } from 'react-router-dom';  // Use Link for navigation
import './slidebar.scss';

const Slidebar = ({setIsReceived}) => {
  return (
    <div className="sidebar-content">
      <img id="slider_logo" src={require('../images/Logo.png')} alt="Logo" />
      <Link to="/dashboard" onClick={() => setIsReceived(false)}>פקעו"ת</Link>
      <Link to="/queue" onClick={() => setIsReceived(true)}>תור</Link>
      <Link to="/settings">הגדרות</Link>
      <Link to="/">יציאה</Link>
    </div>
  );
};

export default Slidebar;
