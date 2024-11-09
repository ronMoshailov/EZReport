import React from 'react';
import './card.scss';

// Card component to display operation number, date, and a send button
const Card = ({ serialNumber, date, onClick, onClickSend }) => {
  return (
    // Main card container with an onClick handler
    <div className="card" onClick={onClick}>
      <h3>פקע: {serialNumber}</h3>           {/* Display operation number in Hebrew */}
      <p>תאריך פתיחה: {date}</p>                {/* Display formatted opening date */}
      
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

export default Card; // Export the Card component for use in other files
