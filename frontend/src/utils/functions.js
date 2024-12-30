// Handle Esc key
const handleEscKey = (event, closeFunction) => {
    if (event.key === 'Escape')                     // Check if the pressed key is "Escape"
    closeFunction();                                // Close modal if Escape is pressed
};

const handleEnterKey = (event, submitFunction) => {
    if (event.key === 'Enter')                      // Check if the pressed key is "Escape"
    submitFunction();                               // Close modal if Escape is pressed
};

// Reset local storage
const resetLocalStorageLoginPage = () => {
    const stringArray = [
        // 'language',
        'workspace',
        'employee_number',
        'reportId',
        'serialNum',
        'title',
        'total',
        'completed',
        'slidebarOption',
    ]

    for (const str of stringArray) {
        localStorage.removeItem(str);
    }
}

const resetLocalStorageDashboard = () => {
    const stringArray = [
        // 'language',
        // 'workspace',
        'employee_number',
        'reportId',
        'serialNum',
        'title',
        'total',
        'completed',
        // 'slidebarOption',
    ]

    for (const str of stringArray) {
        localStorage.removeItem(str);
    }
}

// Print
const print = (arg) => console.log(arg);
const printError = (arg) => console.error(arg);

// Export
export { handleEscKey, handleEnterKey, resetLocalStorageLoginPage, resetLocalStorageDashboard, print, printError };
