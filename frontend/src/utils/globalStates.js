import { createContext, useState } from 'react';
import { textResources } from './data';

const LanguageContext = createContext();

const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('he');
  
    const contextValue = {
      language,
      setLanguage,
      direction: textResources[language].direction,
      text: textResources[language],
    };

    
    return (
        <LanguageContext.Provider value={contextValue}>
          {children}
        </LanguageContext.Provider>
      );
    };


export { LanguageContext, LanguageProvider };
