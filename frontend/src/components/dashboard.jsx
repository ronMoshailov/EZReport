import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CardReport from './cardReport';
import Slidebar from './slidebar';
import OperationModal from './modals/OperationModal';
import Modal_Transfer_Workspace from './modals/modal_Transfer_Workspace';
import './dashboard.scss';
import './slidebar.scss';

import { handleEscKey } from './functions';
import { fetchAllReports } from './APIs/API_report';

const Dashboard = ({isQueue}) => {

    /* States */
    const [workspace, setWorkspace] = useState(localStorage.getItem('workspace'));          // Holds the workspace
    const [reports, setReports] = useState([]);                                             // Holds all the reports
    const [report, setReport] = useState(null);                                             // Holds specific report
    const [loading, setLoading] = useState(true);                                           // Is loading state
    const [error, setError] = useState(null);                                               // Holds error message
    const [isOperationModal, setIsOperationModal] = useState(false);                        // Show operation modal or remove
    const [isSendModalOpen, setIsSendModalOpen] = useState(false);                          // Show transfer modal or remove
    const [isReceived, setIsReceived] = useState(false);                                    // Tetermine if client receiving report or send report
    const [refreshReports, setRefreshReports] = useState(false);                            // Handle case that if this change so fetch reports again
    const [reportFilter, setReportFilter] = useState('');                                   // Filter text for reports 

    const navigate = useNavigate();

    /* useEffect */
    useEffect(() => {
      handleFetchReports();                             // Fetch all reports
    }, [workspace, isQueue, refreshReports]);           // do it if the workspace || isQueue || refreshReports changes 

    useEffect(() => {
      window.addEventListener('keydown', addEscListener);                   // Add keydown event listener to listen for Escape key press
      localStorage.removeItem('employee_number');                           // Clean the local storage
      localStorage.removeItem('report_id');                                 // Clean the local storage
      localStorage.removeItem('report_completed');                          // Clean the local storage
      if(workspace == null)
        console.log('The data was missing.');
        navigate('/error');
      // return () => window.removeEventListener('keydown', addEscListener);   // Clean up event listener on component unmount
    }, []);

    /* Data used in program */
    const workspaceMap = {
      Packing: 'אריזה',
      Production: 'יצור',
      Storage: 'מחסן'
    };

    const triggerRefresh = () => setRefreshReports((prev) => !prev);        // Trigger the refresh of the reports

    // // Fetch all reports
    const handleFetchReports = async () => {
      try {
        const [check, data] = await fetchAllReports(workspace, isQueue);
        if (check)
          setReports(data);
        else
          setError(data);
      } catch (err) {
        setError('An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    // Function to handle card click and show modal
    const handleClickOnCard = (report) => {
      if (!isQueue) {                           // If we are not in queue page
        setReport(report);                      // Holds the selected report
        setIsOperationModal(true);              // Show the operation modal
        };
      }
  
    // Function to handle sending card click and show modal
    const handleMoveWorkspaceButton = (report) => {
      setReport(report);                        // Holds the selected report
      setIsSendModalOpen(true);                 // Show the transfer modal
    };

    // Function to close the modal
    const handleCloseModal = () => {
      setIsOperationModal(false);               // Close the operation modal
      setReport(null);                          // Clear the state the holds the report
      setIsSendModalOpen(false);                // Close the transfer modal
    };

    // Add Esc press key listener
    const addEscListener = (event) => handleEscKey(event, handleCloseModal);

  // Filtered reports
  const filteredReports = reports.filter((report) =>
    report.serialNumber.toLowerCase().includes(reportFilter.toLowerCase())
  );

  // Display loading/error state if necessary
  if (loading) return <p>Loading reports...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="dashboard-layout">
      <div className="dashboard-content">
        <div id='headerDashboard'>
          <h1>עמדת {workspaceMap[workspace]}</h1>                   {/* Label */}
          <input                                                    // Report filter
            type="text"                                             
            placeholder="פקודת עבודה לחיפוש..." 
            value={reportFilter}
            onChange={(e) => setReportFilter(e.target.value)}
            className="search-bar"
          />
        </div>
        
        <div className="cards-container">                               {/* Container for displaying reports as cards */}
          {filteredReports.map(report => (
            <CardReport
              key={report._id}                                          // Unique key for each card
              serialNumber={report.serialNumber}                        // Pass report ID to the card component
              date={new Date(report.openDate).toLocaleDateString()}     // Format the report's date
              onClick={() => handleClickOnCard(report)}                 // Handle click event for opening report
              onClickSend={() => handleMoveWorkspaceButton(report)}     // Handle send button click on card
            />
          ))}
        </div>
      </div>
      
      <div className="sidebar">                                         {/* Sidebar component for additional navigation options */}
        <Slidebar 
          setIsReceived={setIsReceived}                                 // Pass setIsReceived function to Slidebar
        />
      </div>

      {/* Modal for report details, only visible when isOperationModal and not in queue */}
      {isOperationModal && !isQueue && 
        <OperationModal 
          onClose={addEscListener} 
          report_id={report._id} 
          report_serialNum={report.serialNumber} 
          report_completed={ report.completed } 
          report_ordered={ report.ordered } 
          workspace={workspace}
          setIsOperationModal={setIsOperationModal}
        />}

      {/* Send modal for moving reports, only visible when isSendModalOpen */}
      {isSendModalOpen && 
        <Modal_Transfer_Workspace 
          onClose={handleCloseModal} 
          selectedReport={report} 
          isReceived={isReceived} 
          onSuccess={triggerRefresh}
        />}
    </div>
  );
};

export default Dashboard;
