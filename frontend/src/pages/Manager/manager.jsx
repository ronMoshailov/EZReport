import React, { useEffect, useState, useContext } from 'react';
import { io } from 'socket.io-client';

import ManagerModal from '../../components/modals/ManagerModal/ManagerModal';
import { fetchAllReports } from '../../utils/APIs/report';

import './manager.scss';

import { LanguageContext } from '../../utils/globalStates';

const Manager = () => {
  
  const [updates, setUpdates] = useState([]); // State to store real-time updates
  const [error, setError] = useState(null);  // State to handle connection errors
  const [allReports, setAllReports] = useState([]); // State to store all reports
  const [isModal, setIsModal] = useState(false);
  const [operationType, setOperationType] = useState(false);
  
  const { direction, text } = useContext(LanguageContext);
  
  useEffect(() => {
    const socket = io('http://localhost:5000'); // Connect to Socket.IO server

    socket.on('reportStatusUpdated', (change) => {
      console.log('Report status update received:', change);

      const updatedReportId = change.documentKey._id; // Extract the ID of the updated report
      const newStatus = change.updatedStatus;         // Extract the new status
  
      // Update the specific report in allReports
      setAllReports((prevReports) => 
        prevReports.map((report) =>
          report._id === updatedReportId
            ? { ...report, status: newStatus } // Update status of matching report
            : report // Leave other reports unchanged
        )
      );
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
      setError('Unable to connect to the server.');
    });

    return () => {
      console.log('Disconnecting from socket...');
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleReports = async () => {
      try {
        const [isValid, data] = await fetchAllReports();
        if (isValid) setAllReports(data.reports);
      } catch (error) {
        console.error('Error in handleReports:', error.message);
      }
    };

    handleReports();
  }, []);

  const renderTable = (title, filterFn) => (
    <div className="rectangle">
      <h2 className="rectangle-title">{title}</h2>
      <div className="rectangle-table-container">
        <table className="rectangle-table">
          <thead>
            <tr>
              <th>{text.serialNum}</th>
              <th>{text.title}</th>
              <th>{text.status}</th>
              <th>{text.workspace}</th>
            </tr>
          </thead>
          <tbody>
            {allReports.filter(filterFn).map((report) => (
              <tr key={report._id}>
                <td>{report.serialNumber}</td>
                <td>{report.title}</td>
                <td>{report.status}</td>
                <td>{report.current_workspace}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
  

  return (
    <div className="manager-layout" style={{direction}}>
      {/* Right Side */}
      <div className="right-side">
        {/* First Section */}
        <div className="section">
          <label className="label">{text.employees}</label>
          <div className="button-group">
            <button onClick={() => {setIsModal(true); setOperationType('addEmployee')}}>{text.addEmployee}</button>
            <button onClick={() => {setIsModal(true); setOperationType('removeEmployee')}}>{text.removeEmployee}</button>
          </div>
        </div>

        {/* Second Section */}
        <div className="section">
          <label className="label">{text.components}</label>
          <div className="button-group">
            <button onClick={() => {setIsModal(true); setOperationType('addComponent')}}>{text.addComponent}</button>
            <button onClick={() => {setIsModal(true); setOperationType('removeComponent')}}>{text.removeComponent}</button>
            <button onClick={() => {setIsModal(true); setOperationType('addStock')}}>{text.addStock}</button>
            <button onClick={() => {setIsModal(true); setOperationType('updateStock')}}>{text.updateStock}</button>
          </div>
        </div>

        {/* Third Section */}
        <div className="section">
          <label className="label">{text.paka}</label>
          <div className="button-group">
            <button onClick={() => {setIsModal(true); setOperationType('calcAve')}}>{text.calcAve}</button>
          </div>
        </div>
      </div>

      {/* Left Side */}
      <div className="left-side">
        {error && <p className="error-message">{error}</p>}
        {renderTable(text.workOrderInWork, (report) => report.status === 'IN_WORK')}
        {renderTable(text.workOrderNotInWork, (report) => report.status === 'OPEN')}
        {renderTable(text.workOrderFinished, (report) => report.status === 'FINISHED')}
        {renderTable(text.workOrderPending, (report) => report.status === 'PENDING')}
      </div>

      {isModal && 
        <ManagerModal
          operationType={operationType}
          setIsModal={setIsModal}
        />}
    </div>
  );
};

export default Manager;
