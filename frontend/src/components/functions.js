// Handle Esc key
const handleEscKey = (event, closeFunction) => {
    if (event.key === 'Escape')                                         // Check if the pressed key is "Escape"
    closeFunction();                                             // Close modal if Escape is pressed
};


export default { handleEscKey };