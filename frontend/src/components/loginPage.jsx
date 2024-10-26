import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './loginPage.scss';

const LoginPage = ({position, setPosition}) => {

    // States
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [isValid, setIsValid] = useState(null);
    const navigate = useNavigate();
    
    // Each time input changed save the number
    const handleInputChange = (e) => {
        setPosition(e.target.value);
    };
    
    // Handle sumbit
    const handleSubmit = async () => {
        if (!position) {
            setErrorMessage('הכנס בבקשה מספר עמדה תקין');
            return;
        }
        // Active loading && Disactive error message
        setLoading(true);
        setErrorMessage('');

        // Communicate with the server 
        try {
            const response = await fetch(`http://localhost:5000/api/isPositionExist/${position}`);
            // If returned properly
            if (response.ok) {
                const result = await response.json();
                console.log("Returned position from server:", result);  // Log
                if (result.exists) {
                    setIsValid(true);
                    setPosition(result.name);
                    console.log("Logged in as position: " + result.name);  // Log
                    navigate('/dashboard'); // Redirect to dashboard on success
                } else {
                    setIsValid(false);
                    setErrorMessage('מספר עובד לא קיים');
                }
            } else {
                setErrorMessage('שגיאה בבדיקה');
            }
        } catch (error) {
            console.log(error);
            setErrorMessage('החיבור לשרת לא הצליח');
        } finally {
            setLoading(false);
        }
    };

    // Returned HTML
    return (
        <div className="modal-container">
            <div className="modal">
                <button className="close-btn">✕</button>
                <label htmlFor="employee-number">:מספר עמדה</label>
                <input 
                    type="number" 
                    id="employee-number" 
                    placeholder="הכנס מספר עמדה" 
                    value={position} 
                    onChange={handleInputChange} 
                    required 
                />
                <button 
                    className="submit-btn" 
                    onClick={handleSubmit} 
                    disabled={loading}
                > 
                    {loading ? 'המתן' : 'המשך'} 
                </button>
                
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                {isValid && <p className="success-message">שלום....</p>}
            </div>
        </div>
    );
};

export default LoginPage;
