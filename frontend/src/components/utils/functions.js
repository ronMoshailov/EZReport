// Handle Esc key
const handleEscKey = (event, closeFunction) => {
    if (event.key === 'Escape')                                         // Check if the pressed key is "Escape"
    closeFunction();                                             // Close modal if Escape is pressed
};

const isEmpty = (inputValue, setError, setIsLoading) => {
    if(!inputValue.trim()){
        setError('מספר עובד לא יכול להיות ריק');
        setIsLoading(false);
        return false;
        console.log('empty field');
    }

    return true;
}

export { handleEscKey, isEmpty };