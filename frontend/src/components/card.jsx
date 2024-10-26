import React from 'react';
import './card.scss'; // Assuming you have card styles here

const Card = ({ numberOperation, date, onClick, onClickSend }) => {
  return (
    <div className="card" onClick={onClick}>
      <h3>{numberOperation} :פקע</h3>
      <p>תאריך פתיחה: {date}</p>
      <button id='sendIcon' onClick={(e) => {
        e.stopPropagation();  // Prevent triggering the card's onClick when clicking the button
        onClickSend();
      }}>
        &larr; {/* Send icon (arrow) */}
      </button>
    </div>
  );
};

export default Card;
