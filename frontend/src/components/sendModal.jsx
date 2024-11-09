// sendModal.jsx
import React, { useState } from 'react';
import './sendModal.scss';

// SendModal component: handles sending or receiving actions with a modal interface
const SendModal = ({ onClose, selectedReport, isReceived, onSuccess }) => {
const [employeeNumber, setEmployeeNumber] = useState('');

  // handleSubmit function: verifies the employee and either sends or receives a report based on isReceived status
  const handleSubmit = async () => {
    try {
      // Check if employeeNumber is not empty
      if (!employeeNumber) {
        console.error("Employee number is empty.");
        return;
      }
      // console.log(`Employee number: ${employeeNumber}`);

      // Check if employee exists by calling the API
      const response = await fetch('http://localhost:5000/api/isEmployeeExist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: employeeNumber })
      });

      // Check the response
      if (!response.ok) throw new Error(`Failed to fetch employee data. Status: ${response.status}`);

      // Parse the employee data
      const employeeData = await response.json();
      // console.log(employeeData);

      // Check if employee data is valid
      if (!Array.isArray(employeeData.employee) || employeeData.employee.length === 0) {
        // console.log("Employee doesn't exist.");
        return;
      }

      // Get the name
      const employee_id = employeeData.employee[0]._id;

      //  Decide receive/send
      if (isReceived) {
        // console.log('Try to receive');
        console.log(`trying to receive ${isReceived}`);
        await handleReceiveWorkspace(employee_id);
      } else {
        console.log(`trying to send ${isReceived}`);
        await handleSendWorkspace(employee_id);
      }

      onSuccess(); // Trigger a refresh in the Dashboard component
      onClose(); // Close the modal

    } catch (err) {
      console.error("Error:", err.message); // Log any errors
    }
  };

  const fetchLastTransferDetail = async (report_id) => {
    try {
      // Make the GET request to the server
      // console.log(`try to fetch last transfer`);
      const response = await fetch(`http://localhost:5000/api/getLastTransferDetail/${report_id}`, {
          method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      // console.log('A.');
      // Check for successful response
      if (!response.ok) {
        throw new Error(`Failed to fetch last transfer detail. Status: ${response.status}`);
      }
  
      // Parse the response data
      const data = await response.json();
      // console.log('Last Transfer Detail: ', data.lastTransferDetail);
  
      // Return the last transfer detail
      return data.lastTransferDetail;
    } catch (err) {
      // Handle and log any errors
      console.error('Error fetching last transfer detail:', err.message);
      throw err; // Re-throw to handle it where the function is called
    }
  };

  // handleReceiveWorkspace function: handles receiving actions by updating the report data
  const handleReceiveWorkspace = async (employee_id) => {
    // console.log(`trying to receive last transfer.`);
    const transferdetails_id = await fetchLastTransferDetail(selectedReport._id); // Send the _id of the report
    // const transferdetails_id = await returned_transferdetails_id.json();
    // console.log('transferdetails_id: ' + transferdetails_id);

    const sendWorkspaceResponse = await fetch('http://localhost:5000/api/receivedWorkspace', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        transferdetails_id: transferdetails_id,
        received_worker_id: employee_id,
        received_workspace: selectedReport.current_workspace,
        isReceivedd: true
      })
    });

    // Check for response success
    if (!sendWorkspaceResponse.ok) {
      throw new Error(`Failed to receive workspace data. Status: ${sendWorkspaceResponse.status}`);
    }

  };

  // handleSendWorkspace function: handles sending actions by updating the report data and changing workspace
  const handleSendWorkspace = async (employee_id) => {
    console.log(`Trying to send workspace. The data that used is [report_id:${selectedReport._id}, send_worker_id:${employee_id}, send_date: created now, send_workspace:${selectedReport.current_workspace}, isReceivedd: false]`);
    const sendWorkspaceResponse = await fetch('http://localhost:5000/api/sendWorkspace', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        send_worker_id: employee_id,
        send_workspace: selectedReport.current_workspace,
        isReceivedd: false
      })
    });

    // Check for response success
    if (!sendWorkspaceResponse.ok) {
      throw new Error(`Failed to send workspace data. Status: ${sendWorkspaceResponse.status}`);
    }

    // Update the current workspace in the report to the next position in the map
    const data = await sendWorkspaceResponse.json();
    const newTransition_id = data.newTransition_id;
    // console.log(sendWorkspaceResponse);
    // console.log('newTransition_id: ' + newTransition_id);
    
    const updateReport = await fetch('http://localhost:5000/api/updateReportWorkspace', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        report_id: selectedReport._id,
        newTransition_id: newTransition_id
      })
    });

    if (!updateReport.ok) throw new Error(`Failed to update report. Status: ${updateReport.status}`);
    // console.log("workspace data successfully sent and report updated.");

    let response = await fetch('http://localhost:5000/api/toggleEnable', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        report_id: selectedReport._id,
      })
    });

    if (!response.ok) throw new Error(`Failed to update report. Status: ${response.status}`);

  };

  // Render the modal UI
  return (
    <div className="send-modal-container">
      <div className="modal">
        <button className="close-btn" onClick={onClose}>✕</button>
        <h2>{isReceived ? 'קבלה לתחנה הנוכחית' : 'שליחה לתחנה הבאה'}</h2>
        <div className="form-group">
          <label>מספר עובד:</label>
          <input id='sendModalInput' type="text" onChange={(e) => setEmployeeNumber(e.target.value)} />
        </div>
        <button className="submit-btn" onClick={handleSubmit}>המשך</button>
      </div>
    </div>
  );
};

export default SendModal;
