// Modal_Transfer_Workspace.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom'

import './WorkSessionModal.scss';

import { startSession, isStartedSession } from '../../APIs/report'
import { getEmployeeId } from '../../APIs/employee';
import { sendReport } from '../../APIs/workspace';
import { LanguageContext } from '../../../utils/globalStates';

const { isEmpty } = require('../../../utils/functions');


let workspace = '';
let message = '';
let isSucceeded = false;

const WorkSessionModal = ({ reportId, operationType, onClose }) => {
  
  
  const [employeeNumber, setEmployeeNumber] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { direction, text } = useContext(LanguageContext);

  const navigate = useNavigate();

  useEffect(() => {
    workspace = localStorage.getItem('workspace');
    document.documentElement.dir = direction;
  }, []);

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

      const employeeData = await getEmployeeId(Number(employeeNumber));

      if (!employeeData.exist){
        setErrorLoading(text.employeeNotExist, false);
        return;
      }
      switch(operationType){
        case 'send':
          case 'receive':
            isSucceeded = await sendReport(reportId, employeeNumber);
            if(isSucceeded){
              onClose(false);
            } else{
              setErrorLoading(text.notSuccess, false);
            }
            break;

        case 'start':
          const answer = await startSession(reportId, employeeNumber);
          if(answer){
            setErrorLoading(answer, false);
          }
          else
            setErrorLoading(text.reortNotCreated, false)
          break;

        case 'end':
          [isSucceeded, message] = await isStartedSession(reportId, employeeNumber);
          if(!isSucceeded){
            setErrorLoading(message, false);
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
        {/* {console.log(operationType)} */}
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
