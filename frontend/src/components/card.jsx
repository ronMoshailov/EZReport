import React from 'react';
import './card.scss'; // Assuming you have card styles here

const Card = ({ numberOperation, name, date, employeeNumber, onClick }) => {
  return (
    <div className="card" onClick={onClick}>  {/* Step 1: Attach onClick here */}
      <h3>Operation: {numberOperation}</h3>
      <p>Employee: {name}</p>
      <p>Date: {date}</p>
      <p>Employee Number: {employeeNumber}</p>
    </div>
  );
};

export default Card;
