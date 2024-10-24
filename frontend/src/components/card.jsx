import React from 'react';
import './card.scss'; // Assuming you have card styles here

const Card = ({ numberOperation, name, date, employeeNumber }) => {
  return (
    <div className="card">
      <h3>Operation: {numberOperation}</h3>
      <p>Employee: {name}</p>
      <p>Date: {date}</p>
      <p>Employee Number: {employeeNumber}</p>
    </div>
  );
};

export default Card;
