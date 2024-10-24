import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './loginPage.scss';

const LoginPage = () => {
    const [employeeNumber, setEmployeeNumber] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [isValid, setIsValid] = useState(null);
    
    const navigate = useNavigate(); // Initialize useNavigate

    const handleInputChange = (e) => {
        setEmployeeNumber(e.target.value);
    };

    const handleSubmit = async () => {
        if (!employeeNumber) {
            setErrorMessage('הכנס בבקשה מספר עמדה תקין');
            return;
        }

        setLoading(true);
        setErrorMessage('');

        try {
            const response = await fetch(`http://localhost:5000/api/check-employee-number/${employeeNumber}`);

            if (response.ok) {
                const result = await response.json();
                if (result.exists) {
                    setIsValid(true);
                    navigate('/dashboard'); // Redirect to dashboard on success
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

    return (
        <div className="modal-container">
            <div className="modal">
                <button className="close-btn">✕</button>
                <label htmlFor="employee-number">:מספר עובד</label>
                <input 
                    type="number" 
                    id="employee-number" 
                    placeholder="הכנס מספר עמדה" 
                    value={employeeNumber} 
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
