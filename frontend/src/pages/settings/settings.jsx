// Import React libraries
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// Import scss
import './settings.scss';

// Import context
import { LanguageContext } from '../../utils/languageProvider';

// Settings context
const Settings = () => {

  // useContext
  const { language, setLanguage, text } = useContext(LanguageContext);

  // useNavigate
  const navigate = useNavigate(); // Initialize navigation

  // Render
  return (
    <div className="settings-container">
      <h2 className="settings-title">{text.chooseLanguage}</h2>
      <form className="settings-form">
        <label>
          <input
            type="radio"
            value='he'
            checked={language === 'he'}
            onChange={(event) => setLanguage(event.target.value)}
          />
          עברית
        </label>
        <label>
          <input
            type="radio"
            value='en'
            checked={language === 'en'}
            onChange={(event) => setLanguage(event.target.value)}
          />
          English
        </label>
        <label>
          <input
            type="radio"
            value='ru'
            checked={language === 'ru'}
            onChange={(event) => setLanguage(event.target.value)}
          />
          Русский
        </label>
      </form>
      <button className="return-button" onClick={() => navigate(-1)}>{text.return}</button>
    </div>
  );
};

// Export component
export default Settings;
