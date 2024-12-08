import React from 'react';
import './cardReport.scss';

const CardReport = ({ reports, onClickRow, onClickSend }) => {
  
  const handleSendClick = (report) => (event) => {
    event.stopPropagation(); // Prevent row click
    onClickSend(report); // Call the onClickSend function with the report reports
  };

  return (
    <table className="report-table">
      <thead>
        <tr>
          <th>שם</th>
          <th>מספר סידורי</th>
          <th>סטטוס</th>
          <th>תחנה נוכחית</th>
          <th>יוצרו</th>
          <th>נארזו</th>
          <th>הוזמנו</th>
          <th>תאריך פתיחה</th>
          <th>תחילת עבודה</th>
          <th>סיום ודיווח</th>
          <th>שליחה</th>
        </tr>
      </thead>
      <tbody>
        {reports.map((report) => (
          <tr key={report._id} onClick={() => onClickRow(report)}>

            <td>{report.title}</td>
            <td>{report.serialNumber}</td>
            <td>{report.status}</td>

            <td>{report.current_workspace}</td>
            <td>{report.producedCount}</td>
            <td>{report.packedCount}</td>
            <td>{report.orderedCount}</td>

            <td>{new Date(report.openDate).toLocaleDateString()}</td>

            <td>
              <button
                className='buttonIcon'  
                id="startWorkingIcon"
                // onClick={handleSendClick(report)}
              >
                &#8858;
              </button>
            </td>

            <td>
              <button
                className='buttonIcon'  
                id="EndWorkingIcon"
                // onClick={handleSendClick(report)}
              >
                &#8861;
              </button>
            </td>

            <td>
              <button
                className='buttonIcon'  
                id="sendIcon"
                onClick={handleSendClick(report)}
              >
                &larr;
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CardReport;
