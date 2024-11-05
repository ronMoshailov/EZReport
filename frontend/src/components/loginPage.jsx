import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './loginPage.scss';

const LoginPage = ({ position, setPosition }) => {

    // State variables
    const [errorMessage, setErrorMessage] = useState(''); // Holds any error messages
    const [loading, setLoading] = useState(false);        // Indicates loading state during server call
    const [isValid, setIsValid] = useState(null);         // Tracks if position is valid

    // Router navigation setup
    const navigate = useNavigate();
    
    // Update position when input changes
    const handleInputChange = (e) => {
        setPosition(e.target.value);
    };
    
    // Handle form submission
    const handleSubmit = async () => {
        // If position is empty, display error and stop submission
        if (!position) {
            setErrorMessage('הכנס בבקשה מספר עמדה תקין');
            return;
        }
        // Show loading spinner and reset error message
        setLoading(true);
        setErrorMessage('');
        
        // Make server request to check if position exists
        try {
            const response = await fetch(`http://localhost:5000/api/isPositionExist/${position}`);
            
            if (response.ok) { // Server returned 200 status
                const position_data = await response.json();
                
                if (position_data.exists) { // Position exists on server
                    setIsValid(true);       // Set as valid
                    setPosition(position_data.name); // Update position name
                    navigate('/dashboard'); // Redirect to dashboard
                } else {
                    setIsValid(false); // Set as invalid
                    setErrorMessage('מספר עמדה לא קיים'); // Display error
                }
            } else { // Server returned non-200 status
                setErrorMessage('שגיאה בבדיקה');
            }
        } catch (error) { // Network or server error occurred
            setErrorMessage('החיבור לשרת לא הצליח');
        } finally {
            setLoading(false); // Hide loading spinner
        }
    };

    return (
        <div className="modal-container">
            <div className="modal">
                <button className="close-btn">✕</button> {/* Close button */}
                
                {/* Label and input for position number */}
                <label className='bold' htmlFor="employee-number">:מספר עמדה</label>
                <input 
                    type="number" 
                    id="login_input" 
                    placeholder="הכנס מספר עמדה" 
                    value={position} 
                    onChange={handleInputChange} 
                    required 
                />
                
                {/* Submit button shows spinner when loading */}
                <button className="submit-btn" onClick={handleSubmit} disabled={loading}> 
                    {loading ? 'המתן' : 'המשך'} 
                </button>
                
                {/* Error message display */}
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                
                {/* Success message display */}
                {isValid && <p className="success-message">שלום....</p>}
            </div>
        </div>
    );
};

export default LoginPage;
