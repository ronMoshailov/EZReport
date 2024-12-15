import { textResources, localStorageStrings } from './data'

// Handle Esc key
const handleEscKey = (event, closeFunction) => {
    if (event.key === 'Escape')                                         // Check if the pressed key is "Escape"
    closeFunction();                                             // Close modal if Escape is pressed
};

const handleEnterKey = (event, submitFunction) => {
    if (event.key === 'Enter')                                         // Check if the pressed key is "Escape"
    submitFunction();                                             // Close modal if Escape is pressed
};

const isEmpty = (inputValue, setError, setIsLoading) => {
    if(!inputValue.trim()){
        setError('מספר עובד לא יכול להיות ריק');
        setIsLoading(false);
        return false;
    }

    return true;
}

// Cookies
const setCookie = (key, value) => {
    let cookie = `${key}=${encodeURIComponent(value)}; path=/; SameSite=Strict;`;
    // if (options.expires) {
    //     cookie += ` expires=${options.expires.toUTCString()};`;
    // }
    document.cookie = cookie;
};
  
const getCookie = (key) => {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
        const [cookieKey, cookieValue] = cookie.split("=");
        if (cookieKey === key) {
        return decodeURIComponent(cookieValue);
        }
    }
    return null; // Return null if the cookie is not found
};

const deleteCookie = (key) => {
    document.cookie = `${key}=; path=/; max-age=0; SameSite=Strict;`;
};

// const getTextResources = (language) => {
//     if(language === 'he')
//         return textResources.he;
//     if(language === 'en')
//         return textResources.en;
// }

const resetLocalStorage = () => {
    for (const str of localStorageStrings) {
        localStorage.removeItem(str);
    }
}

export { handleEscKey, handleEnterKey, isEmpty, setCookie, getCookie, deleteCookie, resetLocalStorage };