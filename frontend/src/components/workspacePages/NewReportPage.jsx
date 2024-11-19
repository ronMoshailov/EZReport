import React from 'react';
import './newReportPage.scss'; // Import the styles

const NewReportPage = () => {

  // Get date
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(now.getDate()).padStart(2, '0');
  const formattedDate = `${day}-${month}-${year}`;

  return (
    <div className="new-report-page">
      <h1>דיווח חדש מספר 0007</h1>

      <div className="form-container">
        {/* Right Side */}
        <div className="form-column">
          <div className="form-group">
            <label>מספר עובד לדיווח</label>
            <input type="text" placeholder="הכנס מספר עובד" value={ localStorage.getItem('employee_number') } disabled />
            
          </div>

          <div className="form-group">
            <label>מקט</label>
            <input type="text" placeholder="הכנס מקט" value={ localStorage.getItem('report_serialNum') } disabled />
          </div>

          <div className="form-group">
            <label>תאריך</label>
            <input type="text" placeholder="תאריך" value={ formattedDate } disabled />
          </div>

          <div className="form-group">
            <label>תקינים</label>
            <input type="text" placeholder="תקינים" value={ localStorage.getItem('report_completed') } disabled/>
          </div>
        </div>

        {/* Left Side */}
        <div className="form-column">
          <div className="form-group">
            <label>כמות יחידות</label>
            <input type="text" placeholder="כמות יחידות" />
          </div>

          <div className="form-group">
            <label>הערות</label>
            <input id="comments" type="text" placeholder="הערות" />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="buttons-container">
        <button className="delete-button">מחק</button>
        <button className="submit-button">שלח</button>
      </div>
    </div>
  );
};

export default NewReportPage;
