import React, { useState } from 'react';
import './tableContainer.scss';

import WorkSessionModal from '../../components/modals/WorkSessionModal/WorkSessionModal'

const TableContainer = ({ reports, isQueue }) => {
  
  const [isWorkSession, setIsWorkSession] = useState(false);                            // Handle case that if this change so fetch reports again
  const [operationType, setOperationType] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState('');

  const workspace = localStorage.getItem('workspace');

  const handleOperation = (reportId, operation, serialNum, orderedCount, producedCount, packedCount) => (event) => {
    event.stopPropagation(); // Prevent row click
    setIsWorkSession(true);
    setSelectedReportId(reportId);
    setOperationType(operation );
    if(operation === 'send' || operation === 'start' || workspace === 'Storage')
      return;
    if(operation === 'end'){
      localStorage.setItem('serialNum', serialNum);
      if(workspace === 'Production'){
        localStorage.setItem('completed', producedCount);
        localStorage.setItem('total', orderedCount);  
      } else if(workspace === 'Packing'){
        localStorage.setItem('completed', packedCount);
        localStorage.setItem('total', producedCount);
      }
    }
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
          <tr key={report._id}>
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
                onClick={handleOperation(report._id, 'start')}
                disabled={isQueue}
              >
                &#8858;
              </button>
            </td>
            
            <td>
              <button
                className='buttonIcon'  
                id="EndWorkingIcon"
                onClick={handleOperation(report._id, 'end', report.serialNumber, report.orderedCount, report.producedCount, report.packedCount)}
                disabled={isQueue}
              >
                &#8861;
              </button>
            </td>

            <td>
              <button
                className='buttonIcon'  
                id="sendIcon"
                onClick={handleOperation(report._id, isQueue ? 'receive' : 'send')}
              >
                {isQueue ? '→' : '←'}
              </button>
            </td>

          </tr>
        ))}
      </tbody>
    </table>
{/*  (!isQueue || operationType === 'receive' || operationType === 'send') &&  */}
    {isWorkSession && 
        <WorkSessionModal
          reportId={selectedReportId}
          operationType={operationType}
          onClose={setIsWorkSession}
          inQueue={isQueue}
          // orderedCount={}
          // producedCount={}
    />}
  </>
  );
};

export default TableContainer;
