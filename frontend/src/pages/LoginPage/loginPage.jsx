import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { isWorkspaceExist } from '../../utils/APIs/workspace';
import { LanguageContext } from '../../utils/globalStates';

import './loginPage.scss';

import { resetLocalStorage, print } from '../../utils/functions';

const LoginPage = () => {

  const { direction, text } = useContext(LanguageContext);

  const [errorMessage, setErrorMessage] = useState('');   // Holds any error messages
  const [loading, setLoading] = useState(false);          // Indicates loading state during server call
  const [isValid, setIsValid] = useState(null);           // Tracks if Workspace is valid
  const [barcodeBuffer, setBarcodeBuffer] = useState('');           // Tracks if Workspace is valid


  useEffect(() => {
    resetLocalStorage();
  }, []);

  useEffect(() =>{
    if(barcodeBuffer.length === 3){
      handleSubmit();
      setBarcodeBuffer('');
      return;
    }
  }, [barcodeBuffer]);
  
  const navigate = useNavigate();                         // Router navigation setup

  const handleSubmit = async () => {                              
      setLoading(true);                                           // Show loading spinner 
      setErrorMessage('');                                        // Reset error message
      const [isTrue, data] = await isWorkspaceExist(barcodeBuffer);    // Check if the workspace exist in DB
      isTrue ? valid(data) : notValid(data);
      setLoading(false);                              // Hide loading spinner
  }

  function valid(data){
    setIsValid(true);                           // Set as valid
    localStorage.setItem('workspace', data);    // Set workspace in localStorage
    navigate('/dashboard');                     // Redirect to dashboard
  }
  function notValid(data){
    setIsValid(false);                          // Set as invalid
    setErrorMessage(text[data]);                // Display error
  }

  const handleKeyDown = (event) =>{
    if(event.key.length > 1 && event.key != 'Backspace' && event.key != 'Enter') return;
    
    if(event.key === 'Enter'){
      handleSubmit();
      setBarcodeBuffer('');
      return;
    }
    if(event.key === 'Backspace'){
      setBarcodeBuffer((prev) => prev.slice(0, -1));
      return;
    }
    
  }

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
      </div>
  );
};

export default LoginPage;
