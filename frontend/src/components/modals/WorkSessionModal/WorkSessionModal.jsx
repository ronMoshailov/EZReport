// Import react libraries
import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom'

// Import Toast
import { toast } from 'react-toastify';

// Import scss
import './WorkSessionModal.scss';

// Import API
import { startSession } from '../../../utils/APIs/report'
import { getEmployeeId } from '../../../utils/APIs/employee';
import { sendReport } from '../../../utils/APIs/workspace';

// Import context
import { LanguageContext } from '../../../utils/languageProvider';

// Import functions
import { handleEscKey, handleEnterKey } from '../../../utils/functions';

// 

// WorkSessionModal component
const WorkSessionModal = ({ reportId, operationType, onClose, setRefreshReports }) => {
  // useStates
  const [employeeNumber, setEmployeeNumber] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize variables
  const workspace = localStorage.getItem('workspace');
  let message = '';
  let isSucceeded = false;

  // useContext
  const { direction, text } = useContext(LanguageContext);

  // useNavigate
  const navigate = useNavigate();

  // useEffect for initialized component
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        handleEscKey(event, () => onClose(false));
      }
    };
  
    window.addEventListener('keydown', handleKeyDown);
  
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // useEffect for initialized component
  useEffect(() => {
    if(employeeNumber.length === Number(process.env.REACT_APP_EMPLOYEE_BUFFER_LENGTH)) 
      handleSubmit()     
  }, [employeeNumber]);
  
  // Function for set error and loading
  const setErrorLoading = (message, loading) => {
    setError(message);
    setIsLoading(loading);
  }

  // Validate employee existence and perform send/receive action
  const handleSubmit = async () => {
    if(isLoading)
      return;
    
    setErrorLoading('', true);

    try {
      if(!employeeNumber.trim()){
        setError(text.notPossibleEmptyEmployeeNumber);
        setIsLoading(false);
        return;
      }

      const [isExist, employee] = await getEmployeeId(Number(employeeNumber));

      if (!isExist){
        setErrorLoading(text[employee], false);
        return;
      }

      switch(operationType){
        case 'send':
          case 'receive':
            isSucceeded = await sendReport(reportId, employeeNumber);
            if(isSucceeded){
              onClose(false);
              setRefreshReports((perv) => !perv);
            } else{
              setErrorLoading(text.notSuccess, false);
            }
            break;

        case 'start':
          [isSucceeded, message] = await startSession(reportId, employeeNumber, operationType);
          if(isSucceeded){
            onClose(false);
            toast.success(text.startSessionSuccessfully, {className:"toast-success-message"});            // Show display message  
            setRefreshReports((perv) => !perv);
          }
          else
            setErrorLoading(text[message], false)
          break;

        case 'end':
          [isSucceeded, message] = await startSession(reportId, employeeNumber, operationType);
          console.log(localStorage)
          if(!isSucceeded){
            setErrorLoading(text[message], false);
            return;
          }
          localStorage.setItem('employee_number', employeeNumber);
          localStorage.setItem('reportId', reportId);

          if(workspace === 'Storage'){
            navigate('/ReportingStorage');
          }
          else if(workspace === 'Production'){
            navigate('/ReportingProduction');
          }
          else if(workspace === 'Packing'){
            navigate('/ReportingPacking');
          }
          else{
            alert(text.workspaceError);
            navigate('/');
          }
          break;

        default:
          alert(text.InvalidOperation);
          setIsLoading(false);
      }

    } catch (err) {
      console.error('Error during submission:', err.message);
      setErrorLoading(text.generalError, false);
    }
  };

  /* Render */
  return (
    <div className="WorkSessionModal-container" style={{direction}}>
      <div className="modal">
        <button className="close-btn" onClick={() => {onClose(false)}}>✕</button>

        <h2>{operationType === 'send' ? text.sendReport : ''}</h2>
        <h2>{operationType === 'receive' ? text.receiveReport : ''}</h2>
        <h2>{operationType === 'start' ? text.startSession : ''}</h2>
        <h2>{operationType === 'end' ? text.endSession : ''}</h2>

        <div className="form-group">
          <label>{text.employeeNum}:</label>
          <input
            id="sendModalInput"
            type="text"
            value={employeeNumber}
            onChange={(e) => setEmployeeNumber(e.target.value)}            
            placeholder={text.enterEmployeeNum}
            disabled={isLoading}
          />
        </div>
        {error && <p className="errorMessage">{error}</p>}
        <button className="submit-btn" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? `${text.wait}...` : text.sendNow }
        </button>
      </div>
    </div>
  );
};

// Export component
export default WorkSessionModal;
