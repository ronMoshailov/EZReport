// Modal_Transfer_Workspace.jsx
import React, { useState } from 'react';
import './transferWorkspaceModal.scss';
import { isEmployeeExist } from '../APIs/API_employee';
import { getLastTransferDetail, makeReceivedWorkspace, makeSendWorkspace } from '../APIs/API_workspace';

const Modal_Transfer_Workspace = ({ onClose, selectedReport, isReceived }) => {
  
  /* States */
  const [employeeNumber, setEmployeeNumber] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Validate employee existence and perform send/receive action
  const handleSubmit = async () => {
    setError('');
    setIsLoading(true);

    try {
      // Validate input
      console.log(`handleSubmit -> [employeeNumber: ${employeeNumber}]`)
      if (!employeeNumber.trim()) {
        setError('מספר עובד לא יכול להיות ריק');
        setIsLoading(false);
        return;
      }

      // Check employee existence
      const employeeData = await isEmployeeExist(employeeNumber);

      if (!employeeData.exist) {
        setError('עובד לא נמצא במערכת');
        setIsLoading(false);
        return;
      }

      // Decide whether to send or receive
      if (isReceived) {
        // console.log('handleReceiveWorkspace');
        await handleReceiveWorkspace(employeeData.employee._id);
      } else {
        // console.log('handleSendWorkspace');
        await handleSendWorkspace(employeeData.employee._id);
      }

      onClose();   // Close modal
    } catch (err) {
      console.error('Error during submission:', err.message);
      setError('שגיאה במהלך הביצוע');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch the last transfer detail for receiving a workspace
  const fetchLastTransferDetail = async (report_id) => {
    try {
      return await getLastTransferDetail(report_id);
    } catch (err) {
      console.error('Error fetching last transfer detail:', err.message);
      throw err;
    }
  };

  // Handle receiving workspace actions
  const handleReceiveWorkspace = async (employee_id) => {
    try {
      const transferdetails_id = await fetchLastTransferDetail(selectedReport._id);                                         // Last transfer document.
      await makeReceivedWorkspace(transferdetails_id, employee_id, selectedReport.current_workspace, selectedReport._id);   // 
    } catch (err) {
      console.error('Error during workspace receiving:', err.message);
      throw err;
    }

    // toggleEnableAPI
  };

  // Handle sending workspace actions
  const handleSendWorkspace = async (employee_id) => {
    try {
      await makeSendWorkspace(employee_id, selectedReport.current_workspace, selectedReport._id);
    } catch (err) {
      console.error('Error during workspace sending:', err.message);
      throw err;
    }
  };

  /* Render */
  return (
    <div className="employee-modal-container">
      <div className="modal">
        <button className="close-btn" onClick={onClose}>✕</button>
        <h2>{isReceived ? 'קבלה לתחנה הנוכחית' : 'שליחה לתחנה הבאה'}</h2>
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

export default Modal_Transfer_Workspace;
