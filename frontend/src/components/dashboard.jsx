import React, { useState, useEffect } from 'react';
import Card from './card';
import Slidebar from './slidebar';  // Import the sidebar component
import './dashboard.scss'; // Import the dashboard styles
import './slidebar.scss';  // Import the sidebar styles
import Modal from './modal';  // Modal component for showing options
import SendModal from './sendModal'  // Correct the name to PascalCase

const Dashboard = ({position, isQueue}) => {

    // Define state to hold the reports data
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSendModalOpen, setIsSendModalOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);

    // Function to handle card click and show modal
    const handleClickOnCard = (cardData) => {
      setSelectedCard(cardData);  // Set the clicked card data
      setIsModalOpen(true);       // Open the modal
    };

    // Function to handle sending card click and show modal
    const handleMovePosition = (cardData) => {
      setSelectedCard(cardData);  // Set the clicked card data
      setIsSendModalOpen(true);       // Open the modal
    };

    // Function to close the modal
    const handleCloseModal = () => {
      setIsModalOpen(false);
      setSelectedCard(null);
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
          body: JSON.stringify({ position, isQueue})
      });
        if (!response.ok) {
          throw new Error('Failed to fetch reports');
        }
        console.log('Successfully recieved data from the server to the fronted.');
        const data = await response.json();
        setReports(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchReports();
  }, [position, isQueue]);

  // Display loading/error state if necessary
  if (loading) return <p>Loading reports...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="layout">
      <div className="dashboard-content">
        <h1>עמדת {positionMap[position]}</h1>
        <div className="cards-container">
          {/* Map through the reports and create a Card for each report */}
          {reports.map(report => ( 
            <Card
              key={report.id} // Use a unique key for each element
              numberOperation={report.product_num} // Pass product number
              date={new Date(report.openDate).toLocaleDateString()} // Format and pass the date
              onClick={() => handleClickOnCard(report)}  // Handle card click to show modal
              onClickSend={() => handleMovePosition(report)}
              isQueue={isQueue}
            />
          ))}
        </div>
      </div>

      {/* Sidebar on the right */}
      <div className="sidebar">
        <Slidebar />
      </div>
      {isModalOpen && <Modal onClose={handleCloseModal} selectedCard={selectedCard} />}
      {isSendModalOpen && <SendModal onClose={handleCloseModal} selectedCard={selectedCard} />}
    </div>
  );
};

export default Dashboard;
