import React, { useState, useEffect } from 'react';
import CardReport from './cardReport';
import Slidebar from './slidebar';
import OperationModal from './modals/OperationModal';
import Modal_Transfer_Workspace from './modals/modal_Transfer_Workspace';
import functions from './functions';
import { fetchAllReports } from './APIs/API_report';
import './dashboard.scss';
import './slidebar.scss';

const { handleEscKey } = functions;

const Dashboard = ({workspace, isQueue}) => {

    /* States */
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSendModalOpen, setIsSendModalOpen] = useState(false);
    const [report, setReport] = useState(null);
    const [isReceived, setIsReceived] = useState(false);
    const [refreshReports, setRefreshReports] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    /* Data used in program */
    const workspaceMap = {
      Packing: 'אריזה',
      Production: 'יצור',
      Storage: 'מחסן'
    };

    /* Functions */
    const triggerRefresh = () => setRefreshReports((prev) => !prev);

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
      if (!isQueue) {
        setReport(report);  
        setIsModalOpen(true);
      }
    };

    // Function to handle sending card click and show modal
    const handleMoveWorkspaceButton = (report) => {
      setReport(report);
      setIsSendModalOpen(true);
    };

    // Function to close the modal
    const handleCloseModal = () => {
      setIsModalOpen(false);
      setReport(null);
      setIsSendModalOpen(false);
    };

    // Add Esc press key listener
    const addEscListener = (event) => handleEscKey(event, handleCloseModal);

  // Filtered reports based on search query
  const filteredReports = reports.filter((report) =>
    report.serialNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );


  /* useEffect */
  useEffect(() => {
    handleFetchReports();
  }, [workspace, isQueue, refreshReports]); // Add dependencies

  useEffect(() => {
    window.addEventListener('keydown', addEscListener);                   // Add keydown event listener to listen for Escape key press
    return () => window.removeEventListener('keydown', addEscListener);   // Clean up event listener on component unmount
  }, []);

  // Display loading/error state if necessary
  if (loading) return <p>Loading reports...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="dashboard-layout">
      {/* Main content container for the dashboard */}
      <div className="dashboard-content">
        {/* Header section with title and search bar */}
        <div id='headerDashboard'>
          <h1>עמדת {workspaceMap[workspace]}</h1> {/* Display workspace using workspaceMap */}
          <input
            type="text"
            placeholder="פקודת עבודה לחיפוש..."                 // Placeholder text in Hebrew
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}    // Update search query on input change
            className="search-bar"                              // Add styling in CSS if needed
          />
        </div>
        
        {/* Container for displaying reports as cards */}
        <div className="cards-container">
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
      
      {/* Sidebar component for additional navigation options */}
      <div className="sidebar">
        <Slidebar setIsReceived={setIsReceived}/> {/* Pass setIsReceived function to Slidebar */}
      </div>

      {/* Modal for report details, only visible when isModalOpen and not in queue */}
      {isModalOpen && !isQueue && <OperationModal onClose={addEscListener} report_id={report._id} workspace={workspace}/>}

      {/* Send modal for moving reports, only visible when isSendModalOpen */}
      {isSendModalOpen && <Modal_Transfer_Workspace onClose={handleCloseModal} selectedReport={report} isReceived={isReceived} onSuccess={triggerRefresh}/>}
    </div>
  );
};

export default Dashboard;
