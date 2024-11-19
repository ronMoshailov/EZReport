import React from 'react';
import './cardReport.scss';

// Card component to display operation number, date, and a send button
const CardReport = ({ serialNumber, date, onClick, onClickSend }) => {
  return (
    // Main card container with an onClick handler
    <div className="card" onClick={onClick}>
      <h3>פקע: {serialNumber}</h3>
      <p>תאריך פתיחה: {date}</p>
      
      {/* Send button, with an arrow icon */}
      <button id='sendIcon' onClick={(e) => {
        e.stopPropagation();                    // Prevent triggering the card's onClick when clicking the button
        onClickSend();                          // Trigger onClickSend only when button is clicked
      }}>
        &larr; {/* Send icon (arrow) */}
      </button>
    </div>
  );
};

export default CardReport; // Export the Card component for use in other files
