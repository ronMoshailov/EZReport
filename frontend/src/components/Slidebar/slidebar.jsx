import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './slidebar.scss';

import { LanguageContext } from '../../utils/globalStates';

const Slidebar = ({setIsReceived}) => {

  // useContext
  const { text } = useContext(LanguageContext);

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <img id="slider_logo" src={require('../../styles/images/Logo.png')} alt="Logo" />
        <Link to="/dashboard" onClick={() => setIsReceived(false)}>{text.paka}</Link>
        <Link to="/queue" onClick={() => setIsReceived(true)}>{text.queue}</Link>
        <Link to="/settings">{text.settings}</Link>
        <Link to="/">{text.quit}</Link>
      </div>
    </div>
  );
};

export default Slidebar;
