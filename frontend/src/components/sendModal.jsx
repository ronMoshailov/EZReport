// sendModal.jsx
import React from 'react';
import './sendModal.scss';

// SendModal component: handles sending or receiving actions with a modal interface
const SendModal = ({ onClose, selectedReport, isReceive, onSuccess }) => {

  // Mapping of the next station based on the current station
  const nextPositionMap = {
    Packing: 'Out of our system!',
    Production: 'Packing',
    Storage: 'Production'
  };

  // handleSubmit function: verifies the employee and either sends or receives a report based on isReceive status
  const handleSubmit = async () => {
    try {
      // Check if employee exists by calling the API with the input employee number
      const response = await fetch('http://localhost:5000/api/isEmployeeExist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: document.getElementById('sendModalInput').value })
      });

      // Log the employee number for debugging
      console.log(`Employee number: ${document.getElementById('sendModalInput').value}`);

      // Handle error if response is not OK
      if (!response.ok) throw new Error(`Failed to fetch employee data. Status: ${response.status}`);

      // Parse the employee data
      const employeeData = await response.json();

      // Check if employee data is valid
      if (!Array.isArray(employeeData.employee) || employeeData.employee.length === 0) {
        console.log("Employee does not exist.");
        console.log("Array length " + employeeData.employee[0].name);
        return;
      }

      // If employee exists, get the name and decide between receive and send actions
      const name = employeeData.employee[0].name;
      if (isReceive) {
        await handleReceiveStation(name); // Call receive function if isReceive is true
      } else {
        await handleSendStation(name); // Call send function if isReceive is false
      }

      onSuccess(); // Trigger a refresh in the Dashboard component
      onClose(); // Close the modal

    } catch (err) {
      console.error("Error:", err.message); // Log any errors
    }
  };

  // handleReceiveStation function: handles receiving actions by updating the report data
  const handleReceiveStation = async (name) => {
    const sendStationResponse = await fetch('http://localhost:5000/api/receiveStation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        idReport: selectedReport._id,
        receive_worker: name,
        receive_date: new Date().toISOString(),
        receive_station: selectedReport.current_station,
        isFinished: true
      })
    });

    // Check for response success
    if (!sendStationResponse.ok) {
      throw new Error(`Failed to receive station data. Status: ${sendStationResponse.status}`);
    }

    // Update report status to show it’s enabled in the current station
    const updateReport = await fetch('http://localhost:5000/api/updateReportStation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        _id: selectedReport._id,
        current_station: selectedReport.current_station,
        enable: true
      })
    });

    if (!updateReport.ok) throw new Error(`Failed to update report. Status: ${updateReport.status}`);
    console.log("Station data successfully received and report updated.");
  };

  // handleSendStation function: handles sending actions by updating the report data and changing stations
  const handleSendStation = async (name) => {
    const sendStationResponse = await fetch('http://localhost:5000/api/sendStation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        idReport: selectedReport._id,
        send_worker_name: name,
        send_date: new Date().toISOString(),
        send_station: selectedReport.current_station,
        isFinished: false
      })
    });

    // Check for response success
    if (!sendStationResponse.ok) {
      throw new Error(`Failed to send station data. Status: ${sendStationResponse.status}`);
    }

    // Update the current station in the report to the next position in the map
    selectedReport.current_station = nextPositionMap[selectedReport.current_station];
    const updateReport = await fetch('http://localhost:5000/api/updateReportStation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        _id: selectedReport._id,
        current_station: selectedReport.current_station,
        enable: false
      })
    });

    if (!updateReport.ok) throw new Error(`Failed to update report. Status: ${updateReport.status}`);
    console.log("Station data successfully sent and report updated.");
  };

  // Render the modal UI
  return (
    <div className="send-modal-container">
      <div className="modal">
        <button className="close-btn" onClick={onClose}>✕</button>
        <h2>{isReceive ? 'קבלה לתחנה הנוכחית' : 'שליחה לתחנה הבאה'}</h2>
        <div className="form-group">
          <label>מספר עובד:</label>
          <input id='sendModalInput' type="text" />
        </div>
        <button className="submit-btn" onClick={handleSubmit}>המשך</button>
      </div>
    </div>
  );
};

export default SendModal;
