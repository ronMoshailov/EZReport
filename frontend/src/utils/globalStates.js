import { createContext, useState, useMemo } from 'react';
import { textResources } from './data';

const LanguageContext = createContext();

const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('he');
  
    const contextValue = useMemo(() => ({
      language,
      text: textResources[language],
      direction: textResources[language]?.direction || 'ltr',
      setLanguage: (lang) => {
          localStorage.setItem('language', lang);
          setLanguage(lang);
      },
  }), [language]);
    
    return (
        <LanguageContext.Provider value={contextValue}>
          {children}
        </LanguageContext.Provider>
      );
    };


export { LanguageContext, LanguageProvider };
