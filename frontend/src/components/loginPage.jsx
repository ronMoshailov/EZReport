import React, { useState } from 'react';
import './loginPage.scss';

const LoginPage = () => {

    // Determone states
    const [employeeNumber, setEmployeeNumber] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [isValid, setIsValid] = useState(null);

    const handleInputChange = (e) => {
        setEmployeeNumber(e.target.value);
    };

    const handleSubmit = async () => {
        // Check if the text field empty
        if (!employeeNumber) {
            setErrorMessage('הכנס בבקשה מספר עמדה תקין');
            return;
        }
        
        // Set states
        setLoading(true);
        setErrorMessage('');

        
        try {
            // Replace this URL with your actual API endpoint
            const response = await fetch(`http://localhost:5000/api/check-employee-number/${employeeNumber}`);

            if (response.ok) {
                const result = await response.json();
                if (result.exists) {
                    setIsValid(true); // Success message or redirect can be added
                } else {
                    setIsValid(false);
                    setErrorMessage('מספר עובד לא קיים');
                }
            } else {
                setErrorMessage('Error checking employee number');
            }
        } catch (error) {
            console.log(error);
            setErrorMessage('החיבור לשרת לא הצליח');
        } finally {
            setLoading(false);
        }
    };

    return(
        <div className="modal-container">
            <div className="modal">
                <button className="close-btn">✕</button>
                <label htmlFor="employee-number">:מספר עובד</label>
                <input type="number" id="employee-number" placeholder="הכנס מספר עמדה" value={employeeNumber} onChange={handleInputChange} required></input>
                <button className="submit-btn" onClick={handleSubmit} disabled={loading}> {loading ? 'המתן' : 'המשך'} </button>
                {/* Display an error or success message */}
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                {isValid && <p className="success-message">שלום....</p>}

            </div>
        </div>

    )
}

export default LoginPage;