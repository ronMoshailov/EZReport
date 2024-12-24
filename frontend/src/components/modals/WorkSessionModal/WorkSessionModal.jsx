// Modal_Transfer_Workspace.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom'

import './WorkSessionModal.scss';

import { startSession } from '../../../utils/APIs/report'
import { getEmployeeId } from '../../../utils/APIs/employee';
import { sendReport } from '../../../utils/APIs/workspace';
import { LanguageContext } from '../../../utils/globalStates';

import { isEmpty, handleEscKey } from '../../../utils/functions';

let workspace = '';
let message = '';
let isSucceeded = false;

const WorkSessionModal = ({ reportId, operationType, onClose, setRefreshReports }) => {
  
  // useStates
  const [employeeNumber, setEmployeeNumber] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // useContext
  const { direction, text } = useContext(LanguageContext);

  // useNavigate
  const navigate = useNavigate();

  // useEffect
  useEffect(() => {
    workspace = localStorage.getItem('workspace');
    document.documentElement.dir = direction;
    window.addEventListener('keydown', (event) => handleEscKey(event, () => onClose(false)));   // Add keydown event listener to listen for Escape key press
  }, []);

  // Function for set error and loading
  const setErrorLoading = (message, loading) => {
    setError(message);
    setIsLoading(loading);
  }

  // Validate employee existence and perform send/receive action
  const handleSubmit = async () => {
    setErrorLoading('', true);

    try {
      if (!isEmpty(employeeNumber, setError, setIsLoading)) 
        return;

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
          }
          else
            setErrorLoading(text[message], false)
          break;

        case 'end':
          [isSucceeded, message] = await startSession(reportId, employeeNumber, operationType);
          if(!isSucceeded){
            setErrorLoading(text[message], false);
            return;
          }
          localStorage.setItem('employee_number', employeeNumber);
          localStorage.setItem('reportId', reportId);
          console.log(workspace);

          if(workspace === 'Storage'){
            navigate('/ReportingStorage');
            break;
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

export default WorkSessionModal;
