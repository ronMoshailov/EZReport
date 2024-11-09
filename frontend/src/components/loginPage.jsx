import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './loginPage.scss';

const LoginPage = ({ workspace, setWorkspace }) => {

    // State variables
    const [errorMessage, setErrorMessage] = useState(''); // Holds any error messages
    const [loading, setLoading] = useState(false);        // Indicates loading state during server call
    const [isValid, setIsValid] = useState(null);         // Tracks if Workspace is valid

    // Router navigation setup
    const navigate = useNavigate();
    
    // Update Workspace when input changes
    const handleInputChange = (e) => {
        setWorkspace(e.target.value);
    };
    
    // Handle form submission
    const handleSubmit = async () => {
        // If workspace is empty, display error and stop submission
        if (!workspace) {
            setErrorMessage('הכנס בבקשה מספר עמדה תקין');
            return;
        }
        // Show loading spinner and reset error message
        setLoading(true);
        setErrorMessage('');
        
        // Make server request to check if workspace exists
        try {
            const response = await fetch(`http://localhost:5000/api/isWorkspaceExist/${workspace}`);
            
            if (response.ok) { // Server returned 200 status
                const workspace_data = await response.json();
                
                if (workspace_data !== undefined) { // Workspace exists on server
                    setIsValid(true);       // Set as valid
                    setWorkspace(workspace_data.name); // Update Workspace name
                    // console.log(`workspace name is ${workspace_data.name}`)
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
                
                {/* Label and input for workspace number */}
                <label className='bold' htmlFor="employee-number">:מספר עמדה</label>
                <input 
                    type="number" 
                    id="login_input" 
                    placeholder="הכנס מספר עמדה" 
                    value={workspace} 
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
