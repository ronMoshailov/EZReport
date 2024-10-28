import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './loginPage.scss';

const LoginPage = ({position, setPosition}) => {

    // States
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [isValid, setIsValid] = useState(null);

    // Navigate
    const navigate = useNavigate();
    
    // Function: Store the change of the number position 
    const handleInputChange = (e) => {
        setPosition(e.target.value);
    };
    
    // Function: Handle submit
    const handleSubmit = async () => {
        // If the position number is empty
        if (!position) {
            setErrorMessage('הכנס בבקשה מספר עמדה תקין');
            return;
        }
        // Set loading and errors
        setLoading(true);
        setErrorMessage('');
        // Communicate with the server
        try {
            const response = await fetch(`http://localhost:5000/api/isPositionExist/${position}`);
            if (response.ok) {
                const position_data = await response.json();
                // console.log("Returned position from server:", position_data);  // Log
                if (position_data.exists) {
                    setIsValid(true);
                    setPosition(position_data.name);
                    // console.log("Logged in as position: " + position_data.name);  // Log
                    navigate('/dashboard');
                } else {
                    setIsValid(false);
                    setErrorMessage('מספר עמדה לא קיים');
                }
            } else {
                setErrorMessage('שגיאה בבדיקה');
            }
        } catch (error) {
            // console.log(error);
            setErrorMessage('החיבור לשרת לא הצליח');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-container">
            <div className="modal">
                <button className="close-btn">✕</button>
                <label className='bold' htmlFor="employee-number">:מספר עמדה</label>
                <input type="number" id="login_input" placeholder="הכנס מספר עמדה" value={position} onChange={handleInputChange} required />
                <button  className="submit-btn" onClick={handleSubmit} disabled={loading}> {loading ? 'המתן' : 'המשך'} </button>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                {isValid && <p className="success-message">שלום....</p>}
            </div>
        </div>
    );
};

export default LoginPage;
