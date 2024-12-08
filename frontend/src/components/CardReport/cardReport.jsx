import React from 'react';
import './cardReport.scss';

const CardReport = ({ serialNumber, date, onClick, onClickSend }) => {

  const handleSendButtonClick = (onClickSend) => (event) => {
    event.stopPropagation();          // Prevent triggering the parent element's onClick
    onClickSend();                    // Call the provided onClickSend function
  };

  return (
    <div className="card" onClick={onClick}>
      <h3>פקע: {serialNumber}</h3>     
      <p>תאריך פתיחה: {date}</p>
      <button 
        id='sendIcon' 
        onClick={handleSendButtonClick(onClickSend)}>
        &larr;                                              {/* Send icon (arrow) */}
      </button>
    </div>
  );
};

export default CardReport; 
