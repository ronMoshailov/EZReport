import React, { useState, useEffect } from 'react';
import Card from './card';
import Slidebar from './slidebar';  // Import the sidebar component
import './dashboard.scss'; // Import the dashboard styles
import './slidebar.scss';  // Import the sidebar styles
import Modal from './modal';  // Modal component for showing options
import SendModal from './sendModal'  // Correct the name to PascalCase
import { useNavigate } from 'react-router-dom';

const Dashboard = ({position, isQueue}) => {

    // Define state to hold the reports data
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSendModalOpen, setIsSendModalOpen] = useState(false);
    const [report, setReport] = useState(null);
    const [isReceive, setIsReceive] = useState(false);
    const [refreshReports, setRefreshReports] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const triggerRefresh = () => setRefreshReports((prev) => !prev); // Toggle refresh

    // Function to handle card click and show modal
    const handleClickOnCard = (report) => {
      if (!isQueue) { // Only open modal if not in queue
        setReport(report);  
        setIsModalOpen(true);
      }
      // else if(position === 'Storage'){
      //   navigate('/newStorageReport'); // Navigate to newStorageReport if position is Storage
      // }
    };
    
    // Function to handle sending card click and show modal
    const handleMovePositionButton = (report) => {
      setReport(report);  // Set the clicked card data
      setIsSendModalOpen(true);       // Open the modal
    };

    // Function to close the modal
    const handleCloseModal = () => {
      setIsModalOpen(false);
      setReport(null);
      setIsSendModalOpen(false);
    };
    
    // Map for positions
    const positionMap = {
      Packing: 'אריזה',
      Production: 'יצור',
      Storage: 'מחסן'
  };

  // Fetch data from the backend when the component mounts
  useEffect(() => {
    const fetchReports = async () => {
      try {
        console.log('Trying to fetch all related reports.');
        const response = await fetch('http://localhost:5000/api/getReports', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ position, isQueue })
        });
        if (!response.ok) throw new Error('Failed to fetch reports');
        
        const data = await response.json();
        setReports(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchReports();
  }, [position, isQueue, refreshReports]); // Re-fetch when `refreshReports` changes

  // Filtered reports based on search query
  const filteredReports = reports.filter((report) =>
    report.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Display loading/error state if necessary
  if (loading) return <p>Loading reports...</p>;
  if (error) return <p>Error: {error}</p>;

    return (
      <div className="layout">
        <div className="dashboard-content">
          <div id='headerDashboard'>
            <h1>עמדת {positionMap[position]}</h1>
            <input
              type="text"
              placeholder="פקודת עבודה לחיפוש..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-bar" // Add styling in CSS if needed
            />
          </div>
          
          <div className="cards-container">
            {filteredReports.map(report => (
              <Card
                key={report.id}
                numberOperation={report.id}
                date={new Date(report.openDate).toLocaleDateString()}
                onClick={() => handleClickOnCard(report)}
                onClickSend={() => handleMovePositionButton(report)}
              />
            ))}
          </div>
        </div>
        
        <div className="sidebar">
          <Slidebar setIsReceive={setIsReceive}/>
        </div>
        {isModalOpen && !isQueue && <Modal onClose={handleCloseModal} selectedReport={report} position={position}/>}
        {isSendModalOpen && <SendModal onClose={handleCloseModal} selectedReport={report} isReceive={isReceive} onSuccess={triggerRefresh} />}
      </div>
    );
};

export default Dashboard;
