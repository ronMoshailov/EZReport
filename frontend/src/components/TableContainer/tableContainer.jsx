import React, { useState } from 'react';
import './tableContainer.scss';

import WorkSessionModal from '../../components/modals/WorkSessionModal/WorkSessionModal'

const TableContainer = ({ reports, onClickRow, isQueue }) => {
  
  const [isWorkSession, setIsWorkSession] = useState(false);                            // Handle case that if this change so fetch reports again
  const [operationType, setOperationType] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState('');

  const handleSendClick = (reportId, operation) => (event) => {
    event.stopPropagation(); // Prevent row click
    setIsWorkSession(true);
    console.log('reportId');
    console.log(reportId);
    setSelectedReportId(reportId);
    setOperationType(operation);
  };

  return (
    <>
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
                onClick={handleSendClick(report._id, 'start')}
              >
                &#8858;
              </button>
            </td>

            <td>
              <button
                className='buttonIcon'  
                id="EndWorkingIcon"
                onClick={handleSendClick(report._id, 'end')}
              >
                &#8861;
              </button>
            </td>

            <td>
              <button
                className='buttonIcon'  
                id="sendIcon"
                onClick={handleSendClick(report._id, 'send')}
              >
                {isQueue ? '→' : '←'}
              </button>
            </td>

          </tr>
        ))}
      </tbody>
    </table>

    {isWorkSession &&
        <WorkSessionModal
          reportId={selectedReportId}
          operationType={operationType}
          onClose={setIsWorkSession}
          // reportSerialNum={}
          // orderedCount={}
          // producedCount={}
    />}
  </>
  );
};

export default TableContainer;
