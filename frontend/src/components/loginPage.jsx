import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isWorkspaceExist } from './APIs/API_workspace';
import './loginPage.scss';

const LoginPage = () => {

    const [errorMessage, setErrorMessage] = useState('');   // Holds any error messages
    const [loading, setLoading] = useState(false);          // Indicates loading state during server call
    const [isValid, setIsValid] = useState(null);           // Tracks if Workspace is valid
    const [workspace, setWorkspace] = useState('');         // Holds the workspace

    useEffect(() => {
        // localStorage.removeItem('employee_number');         // Clean the local storage
        // localStorage.removeItem('workspace');               // Clean the local storage
        // localStorage.removeItem('report_id');               // Clean the local storage
        // localStorage.removeItem('report_completed');        // Clean the local storage
        // localStorage.removeItem('report_serialNum');        // Clean the local storage
        // localStorage.removeItem('report_ordered');          // Clean the local storage
        localStorage.clear();
      }, []);

    const navigate = useNavigate();                         // Router navigation setup
    
    // Hnadle input change
    const handleInputChange = (setter) => (event) => {
        setter(event.target.value);
      };
    
    // Handle submit
    const handleSubmit = async () => {                              // Handle form submission
        setLoading(true);                                           // Show loading spinner 
        setErrorMessage('');                                        // Reset error message
        const [check, data] = await isWorkspaceExist(workspace);    // Check if the workspace exist in DB

        if(check){
            setIsValid(true);                           // Set as valid
            localStorage.setItem('workspace', data);    // Set workspace in localStorage
            navigate('/dashboard');                     // Redirect to dashboard
        }
        else{
            setIsValid(false);                          // Set as invalid
            setErrorMessage(data);                      // Display error
        }
        
        setLoading(false);                              // Hide loading spinner
    }

    return (
        <div className="modal-container-loginPage">
            <div className="modal">
                {/* <button                                             // Close button 
                  className="close-btn">
                    ✕
                </button>  */}
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
                  onChange={handleInputChange(setWorkspace)} 
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
