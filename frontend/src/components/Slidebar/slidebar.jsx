// Import React libraries
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';

// Import scss
import './slidebar.scss';

// Import context
import { LanguageContext } from '../../utils/languageProvider';

// Slidebar component
const Slidebar = () => {

  // useContext
  const { text } = useContext(LanguageContext);
  const [activeLink, setActiveLink] = useState(localStorage.getItem('slidebarOption') || '/dashboard');
  const [hoveredLink, setHoveredLink] = useState(null);

  // Dynamic style for button
  const buttonStyle = (link) => ({
    background: hoveredLink === link ? '#8cc0e5' : activeLink === link ? '#9ed6ff' : 'transparent',
    padding: '10px 20px',
    borderRadius: '20px',
    fontSize: '18px',
    margin: '15px 0',
    textDecoration: 'none',
    color: '#333',
  })
  
  // Render
  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <img id="slider_logo" src={require('../../styles/images/Logo.png')} alt="Logo" />

        {/* Dashboard link */}
        <Link 
        to="/dashboard" 
        style={buttonStyle('/dashboard')} 
        onClick={() => {
          setActiveLink('/dashboard');
          localStorage.setItem('slidebarOption', '/dashboard');
        }}
        onMouseEnter={() => setHoveredLink('/dashboard')}
        onMouseLeave={() => setHoveredLink(null)}
        >
          {text.paka}
        </Link>
        
        {/* Queue link */}
        <Link 
        to="/queue" 
        style={buttonStyle('/queue')} 
        onClick={() => {
          setActiveLink('/queue');
          localStorage.setItem('slidebarOption', '/queue');
        }}
        onMouseEnter={() => setHoveredLink('/queue')}
        onMouseLeave={() => setHoveredLink(null)}
        >
          {text.queue}
        </Link>

        {/* Settings link */}
        <Link 
        to="/settings"
        style={buttonStyle('/settings')} 
        onMouseEnter={() => setHoveredLink('/settings')}
        onMouseLeave={() => setHoveredLink(null)}
        >
          {text.settings}
        </Link>

        {/* Quit link */}
        <Link 
        to="/"
        style={buttonStyle('/')} 
        onMouseEnter={() => setHoveredLink('/')}
        onMouseLeave={() => setHoveredLink(null)}
        >
          {text.quit}
        </Link>

      </div>
    </div>
  );
};

// Export component
export default Slidebar;
