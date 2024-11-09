import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from './card';
import Slidebar from './slidebar';
import OperationModal from './OperationModal';
import SendModal from './sendModal';
import './dashboard.scss';
import './slidebar.scss';

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

    // Function to handle card click and show modal
    const handleClickOnCard = (report) => {
      if (!isQueue) { // Only open modal if not in queue
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

  // Filtered reports based on search query
  const filteredReports = reports.filter((report) =>
    report.serialNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );


  /* useEffect */
  // useEffect hook to fetch reports when component mounts or dependencies change
  useEffect(() => {
    const fetchReports = async () => {
      try {
        // console.log('Trying to fetch all related reports. current workspace is: ' + workspace);

        // Send POST request to fetch reports based on `workspace` and `isQueue` state
        const response = await fetch('http://localhost:5000/api/getReports', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ workspace, isQueue }) // Pass `workspace` and `isQueue` in the request body
        });

        // Check if response is successful, throw error if not
        if (!response.ok) throw new Error('Failed to fetch reports');

        // Parse response data and update state
        const data = await response.json();
        // console.log(data);
        setReports(data);
        setLoading(false); // Set loading state to false after fetching
      } catch (err) {
        // Handle any errors by setting error message and updating loading state
        setError(err.message);
        setLoading(false);
      }
    };

    // Call fetchReports function to initiate fetch
    fetchReports();
  }, [workspace, isQueue, refreshReports]); // Re-fetch when `workspace`, `isQueue`, or `refreshReports` changes

  // useEffect hook to handle "Escape" key press for closing modals
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') { // Check if the pressed key is "Escape"
        handleCloseModal(); // Close modal if Escape is pressed
      }
    };

    // Add keydown event listener to listen for Escape key press
    window.addEventListener('keydown', handleEscKey);

    // Clean up event listener on component unmount
    return () => window.removeEventListener('keydown', handleEscKey);
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
            placeholder="פקודת עבודה לחיפוש..." // Placeholder text in Hebrew
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Update search query on input change
            className="search-bar" // Add styling in CSS if needed
          />
        </div>
        
        {/* Container for displaying reports as cards */}
        <div className="cards-container">
          {filteredReports.map(report => (
            <Card
              key={report._id} // Unique key for each card
              serialNumber={report.serialNumber} // Pass report ID to the card component
              date={new Date(report.openDate).toLocaleDateString()} // Format the report's date
              onClick={() => handleClickOnCard(report)} // Handle click event for opening report
              onClickSend={() => handleMoveWorkspaceButton(report)} // Handle send button click on card
            />
          ))}
        </div>
      </div>
      
      {/* Sidebar component for additional navigation options */}
      <div className="sidebar">
        <Slidebar setIsReceived={setIsReceived}/> {/* Pass setIsReceived function to Slidebar */}
      </div>

      {/* Modal for report details, only visible when isModalOpen and not in queue */}
      {isModalOpen && !isQueue && <OperationModal onClose={handleCloseModal} report_id={report._id} workspace={workspace}/>}

      {/* Send modal for moving reports, only visible when isSendModalOpen */}
      {isSendModalOpen && <SendModal onClose={handleCloseModal} selectedReport={report} isReceived={isReceived} onSuccess={triggerRefresh} />}
    </div>
  );
};

export default Dashboard;