import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { isWorkspaceExist } from '../../components/APIs/workspace';
import './loginPage.scss';

const LoginPage = () => {

    const [errorMessage, setErrorMessage] = useState('');   // Holds any error messages
    const [loading, setLoading] = useState(false);          // Indicates loading state during server call
    const [isValid, setIsValid] = useState(null);           // Tracks if Workspace is valid
    const [workspace, setWorkspace] = useState('');         // Holds the workspace

    useEffect(() => { 
      localStorage.clear();
    }, []);
        
    const navigate = useNavigate();                         // Router navigation setup

    /**
     * Handle form submission for workspace validation.
     * This function validates the workspace, stores it in localStorage if valid, 
     * and redirects the user to the dashboard. If invalid, it displays an error message.
     */
    const handleSubmit = async () => {                              
        setLoading(true);                                           // Show loading spinner 
        setErrorMessage('');                                        // Reset error message
        const [check, data] = await isWorkspaceExist(workspace);    // Check if the workspace exist in DB
        check ? valid(data) : notValid(data);
        setLoading(false);                              // Hide loading spinner
    }

    function valid(data){
      setIsValid(true);                           // Set as valid
      localStorage.setItem('workspace', data);    // Set workspace in localStorage
      navigate('/dashboard');                     // Redirect to dashboard
    }
    function notValid(data){
      setIsValid(false);                          // Set as invalid
      setErrorMessage(data);                      // Display error
    }

    return (
        <div className="modal-container-loginPage">
            <div className="modal">
                <label                                              // Label
                  className='bold' 
                  htmlFor="employee-number">
                  :מספר עמדה
                </label>
                <input                                              // Input
                  type="number" 
                  id="login_input" 
                  placeholder="הכנס מספר עמדה" 
                  value={workspace} 
                  onChange={(event) => setWorkspace(event.target.value)} 
                  required 
                />
                <button                                             // Submit button
                  className="submit-btn" 
                  onClick={handleSubmit} 
                  disabled={loading}> 
                  {loading ? 'המתן' : 'המשך'} 
                </button>
                {errorMessage &&                                    // Error message
                <p className="errorMessage">
                    {errorMessage}
                </p>
                }
                {isValid &&                                         // isValid message
                <p className="success-message"
                    >שלום....
                </p>}
            </div>
        </div>
    );
};

export default LoginPage;
