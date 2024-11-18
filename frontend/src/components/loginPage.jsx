import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isWorkspaceExist } from './APIs.js';
import './loginPage.scss';

const LoginPage = ({workspace, setWorkspace}) => {

    // State variables
    const [errorMessage, setErrorMessage] = useState(''); // Holds any error messages
    const [loading, setLoading] = useState(false);        // Indicates loading state during server call
    const [isValid, setIsValid] = useState(null);         // Tracks if Workspace is valid
    
    // Router navigation setup
    const navigate = useNavigate();

    // Handle form submission
    const handleSubmit = async () => {
        
        if (!workspace) {
            setErrorMessage('הכנס בבקשה מספר עמדה תקין');
            return;
        }
        // Show loading spinner and reset error message
        setLoading(true);
        setErrorMessage('');
        
        const [check, data] = await isWorkspaceExist(workspace);

        if(check){
            setIsValid(true);                           // Set as valid
            setWorkspace(data);                         // Update Workspace name
            navigate('/dashboard');                     // Redirect to dashboard
        }
        else{
            setIsValid(false);                          // Set as invalid
            setErrorMessage(data);                      // Display error
        }
        setLoading(false);                              // Hide loading spinner
    }

    return (
        <div className="modal-container">
            <div className="modal">
                <button className="close-btn">✕</button>                                     {/* Close button */}
                
                <label className='bold' htmlFor="employee-number">:מספר עמדה</label>         {/* Label and input for workspace number */}
                <input 
                    type="number" 
                    id="login_input" 
                    placeholder="הכנס מספר עמדה" 
                    value={workspace} 
                    onChange={(e) => { setWorkspace(e.target.value); }} 
                    required 
                />
                
                <button className="submit-btn" onClick={handleSubmit} disabled={loading}>    {/* Submit button shows spinner when loading */} 
                    {loading ? 'המתן' : 'המשך'} 
                </button>
                
                {errorMessage && <p className="error-message">{errorMessage}</p>}            {/* Error message display */}
                
                {isValid && <p className="success-message">שלום....</p>}                     {/* Success message display */}
            </div>
        </div>
    );
};

export default LoginPage;
