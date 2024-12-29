import { createContext, useState, useMemo, useEffect } from 'react';
import { textResources } from './data';

const LanguageContext = createContext();

const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(localStorage.getItem('language') || 'he');

    useEffect(() => {
      localStorage.setItem('language', language);
    }, [language]);

    // Creating the context
    const contextValue = useMemo(() => ({
      language,
      text: textResources[language],
      direction: textResources[language]?.direction || 'ltr',
      setLanguage: (lang) => {
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
