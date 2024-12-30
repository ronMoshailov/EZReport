// Import React libraries
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// Import Toast
import { toast } from 'react-toastify';

// Import scss
import './loginPage.scss';

// Import API
import { isWorkspaceExist } from '../../utils/APIs/workspace';

// import context
import { LanguageContext } from '../../utils/languageProvider';

// Import functions
import { resetLocalStorageLoginPage } from '../../utils/functions';

// LoginPage component
const LoginPage = () => {

  // useState
  const [errorMessage, setErrorMessage] = useState('');     // Holds any error messages
  const [loading, setLoading] = useState(false);            // Indicates loading state during server call
  const [barcodeBuffer, setBarcodeBuffer] = useState('');   // Tracks if Workspace is valid

  // Constant variables
  const workspaceLength = process.env.REACT_APP_BARCODE_BUFFER_LENGTH;

  // use Context
  const { direction, text } = useContext(LanguageContext);

  // useEffect for initialized component
  useEffect(() => {
    resetLocalStorageLoginPage();
  }, []);

  // useEffect for changing input
  useEffect(() =>{
    if(barcodeBuffer.length === workspaceLength){
      handleSubmit();
      return;
    }
  }, [barcodeBuffer]);

  // useNavigate
  const navigate = useNavigate();

  // Functions
  // Handle submit
  const handleSubmit = async () => {
    if(loading)
      return;
    setLoading(true);                                               // Show loading spinner 
    setBarcodeBuffer('');                                           // Reset the input value
    setErrorMessage('');                                            // Reset error message
    const [isTrue, data] = await isWorkspaceExist(barcodeBuffer);   // Check if the workspace exist in DB
    isTrue ? valid(data) : setErrorMessage(text[data]);;            // If exist set valid operations , else set error message
    setLoading(false);                                              // Hide loading spinner
  }

  // Handle valid workspace
  function valid(data){
    localStorage.setItem('workspace', data);                                                     // Set workspace in localStorage
    if(data === 'Manager')
      navigate('/manager');  
    else{
      toast.success(text.connectionToWorkspaceSucceeded, {className:"toast-success-message"});     // Show display message  
      navigate('/dashboard');                                                                      // Redirect to dashboard
    }
  }

  // Handle key down
  const handleKeyDown = (event) =>{
    // If it's not a lette && not Enter && not Backspace => Every operation that is not a letter, Enter or Backspace
    if(event.key.length > 1 && event.key !== 'Backspace' && event.key !== 'Enter')    
      return;
        
    // If selected 'Enter'
    if(event.key === 'Enter'){
      handleSubmit();
      return;
    }

    // If selected 'Backspace'
    if(event.key === 'Backspace'){
      setBarcodeBuffer((prev) => prev.slice(0, -1));
      return;
    }
  }

  // Render
  return (
      <div className="modal-container-loginPage" style={{ direction }}>
          <div className="modal" onKeyDown={handleKeyDown}>
              <label                                              // Label
                className='bold' 
                htmlFor="employee-number">
                {text.workspaceNumber}:
              </label>
              <input                                              // Input
                type="number" 
                id="login_input" 
                placeholder={text.enterNumWorkspace} 
                value={barcodeBuffer}
                onChange={(event) => setBarcodeBuffer(event.target.value)}
                required 
                disabled={loading}
              />
              <button                                             // Submit button
                className="submit-btn" 
                onClick={handleSubmit} 
                disabled={loading}> 
                {loading ? text.wait : text.login} 
              </button>
              {errorMessage &&                                    // Error message
              <p className="errorMessage">
                  {errorMessage}
              </p>
              }
          </div>
          <button id='settingsButton' style={{[direction === 'ltr' ? 'left' : 'right']: '20px'}} onClick={() => navigate('/settings')}>{text.settings}</button>
      </div>
  );
};

// Export component
export default LoginPage;
