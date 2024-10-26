// sendModal.jsx
import React from 'react';
import './sendModal.scss';

const SendModal = ({ onClose, selectedReport, isReceive, onSuccess }) => {
  const nextPositionMap = {
    Packing: 'Out of our system!',
    Production: 'Packing',
    Storage: 'Production'
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/isEmployeeExist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: document.getElementById('sendModalInput').value })
      });

      if (!response.ok) throw new Error(`Failed to fetch employee data. Status: ${response.status}`);

      const employeeData = await response.json();
      if (!Array.isArray(employeeData) || employeeData.length === 0) {
        console.log("Employee does not exist.");
        return;
      }

      const name = employeeData[0].name;
      if (isReceive) {
        await handleReceiveStation(name);
      } else {
        await handleSendStation(name);
      }

      onSuccess(); // Trigger refresh in `Dashboard`
      onClose(); // Close the modal
    } catch (err) {
      console.error("Error:", err.message);
    }
  };

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

    if (!sendStationResponse.ok) {
      throw new Error(`Failed to receive station data. Status: ${sendStationResponse.status}`);
    }

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

    if (!sendStationResponse.ok) {
      throw new Error(`Failed to send station data. Status: ${sendStationResponse.status}`);
    }

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

  return (
    <div className="modal-container">
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
