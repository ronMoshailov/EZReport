// Import React libraries
import React, { useState, useContext } from 'react';

// Import scss
import './tableContainer.scss';

// Import components
import WorkSessionModal from '../../components/modals/WorkSessionModal/WorkSessionModal'

// Import context
import { LanguageContext } from '../../utils/globalStates';

// TableContainer component
const TableContainer = ({ reports, isQueue, setRefreshReports }) => {
  
  // useState
  const [isWorkSession, setIsWorkSession] = useState(false);                            // Handle case that if this change so fetch reports again
  const [operationType, setOperationType] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState('');
  
  // Contant variables
  const workspace = localStorage.getItem('workspace');

  // useContext
  const { direction, text } = useContext(LanguageContext);

  // Hnadle any operation of the button
  const handleOperation = (reportId, operation, serialNum, title, orderedCount, producedCount, packedCount) => (event) => {
    event.stopPropagation(); // Prevent row click
    setIsWorkSession(true);
    setSelectedReportId(reportId);
    setOperationType(operation );
    if(operation === 'send' || operation === 'start' || workspace === 'Storage')
      return;
    if(operation === 'end'){
      localStorage.setItem('serialNum', serialNum);
      localStorage.setItem('title', title);
      if(workspace === 'Production'){
        localStorage.setItem('completed', producedCount);
        localStorage.setItem('total', orderedCount);  
      } else if(workspace === 'Packing'){
        localStorage.setItem('completed', packedCount);
        localStorage.setItem('total', producedCount);
      }
    }
  };

  // Render
  return (
    <>
    <table className="report-table">
      <thead>
        <tr>
          <th>{text.name}</th>
          <th>{text.serialNum}</th>
          <th>{text.status}</th>
          <th>{text.currentStation}</th>
          <th>{text.produced}</th>
          <th>{text.packed}</th>
          <th>{text.ordered}</th>
          <th>{text.openedDate}</th>
          <th>{text.startSession}</th>
          <th>{text.endSession}</th>
          <th>{text.send}</th>
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
                onClick={handleOperation(report._id, 'end', report.serialNumber, report.title, report.orderedCount, report.producedCount, report.packedCount)}
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
                {direction === 'rtl' ? (isQueue ? '→' : '←') : (isQueue ? '←' : '→')}
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
          inQueue={isQueue}
          setRefreshReports={setRefreshReports}
    />}
  </>
  );
};

// Export component
export default TableContainer;
