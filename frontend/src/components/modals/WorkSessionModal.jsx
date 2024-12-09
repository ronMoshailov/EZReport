// Modal_Transfer_Workspace.jsx
import React, { useState, useNavi } from 'react';
import { useNavigate } from 'react-router-dom'

import './WorkSessionModal.scss';

import { startSession } from '../APIs/report'
import { isEmployeeExist } from '../APIs/employee';
import { sendReport } from '../APIs/workspace';

const { isEmpty } = require('../utils/functions');

const workspace = localStorage.getItem('workspace');

const WorkSessionModal = ({ reportId, operationType, onClose }) => {
  
  const [employeeNumber, setEmployeeNumber] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

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

      const employeeData = await isEmployeeExist(Number(employeeNumber));

      if (!employeeData.exist){
        setErrorLoading('עובד לא נמצא במערכת', false);
        return;
      }

      switch(operationType){
        case 'send':
          let isSucceeded = await sendReport(reportId, employeeNumber);
          if(isSucceeded){
            onClose(false);
          } else{
            setErrorLoading('לא הצליח', false);
          }
          break;

        case 'start':
          const answer = startSession(reportId, employeeNumber);
          if(answer){
            setErrorLoading('', false);
            onClose(false)
          }
          else
            setErrorLoading('דיווח לא נוצר', false)
          break;

        case 'end':
          if(workspace === 'Storage') 
            navigate('/ReportingStorage');
          else if(workspace === 'Production') 
            navigate('/ReportingProduction');
          else if(workspace === 'Packing') 
            navigate('/ReportingPacking');
          else{
            alert('יש בעיה עם העמדה, אנה התחבר מחדש');
            navigate('/');
          }
          break;

      }

    } catch (err) {
      console.error('Error during submission:', err.message);
      setErrorLoading('שגיאה במהלך הביצוע', false);
    }
  };

  /* Render */
  return (
    <div className="WorkSessionModal-container">
      <div className="modal">
        <button className="close-btn" onClick={() => {onClose(false)}}>✕</button>

        <h2>{operationType === 'send' ? 'שליחה לתחנה הבאה' : ''}</h2>
        <h2>{operationType === 'receive' ? 'קבלה לתחנה הנוכחית' : ''}</h2>
        <h2>{operationType === 'start' ? 'תחילת עבודה' : ''}</h2>
        <h2>{operationType === 'end' ? 'סיום ודיווח' : ''}</h2>

        <div className="form-group">
          <label>מספר עובד:</label>
          <input
            id="sendModalInput"
            type="text"
            value={employeeNumber}
            onChange={(e) => setEmployeeNumber(e.target.value)}
            placeholder="הכנס מספר עובד"
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button className="submit-btn" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? 'מבצע...' : 'המשך'}
        </button>
      </div>
    </div>
  );
};

export default WorkSessionModal;
