import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useDebounce } from 'use-debounce';

import TableContainer from '../../components/TableContainer/tableContainer';
import Slidebar from '../../components/Slidebar/slidebar';
// import OperationModal from '../../components/modals/OperationModal';
import ModalTransferWorkspace from '../../components/modals/transferWorkspaceModal';

import './dashboard.scss';
import '../../components/Slidebar/slidebar.scss';

import { handleEscKey } from '../../components/utils/functions';
import { fetchAllReports } from '../../components/APIs/report';

const Dashboard = ({isQueue}) => {

  // States
  const [reports, setReports] = useState([]);                                             // Holds all the reports
  const [report, setReport] = useState(null);                                             // Holds specific report
  const [loading, setLoading] = useState(true);                                           // Is loading state
  const [error, setError] = useState(null);                                               // Holds error message
  // const [isOperationModal, setIsOperationModal] = useState(false);                        // Show operation modal or remove
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);                          // Show transfer modal or remove
  const [isReceived, setIsReceived] = useState(false);                                    // Tetermine if client receiving report or send report
  const [refreshReports, setRefreshReports] = useState(false);                            // Handle case that if this change so fetch reports again
  const [reportFilter, setReportFilter] = useState('');                                   // Filter text for reports
  // const [operationType, setOperationType] = useState('');                            // Handle case that if this change so fetch reports again

  // Constant variables
  const workspace = localStorage.getItem('workspace') || '';

  const clearStorage = [
    'employee_number', 
    'report_id', 
    'report_producedCount', 
    'report_packedCount', 
    'report_serialNum', 
    'report_orderedCount'
  ];

  const workspaceMap = {
    Packing: 'אריזה',
    Production: 'יצור',
    Storage: 'מחסן'
  };




  const navigate = useNavigate();
  // const [debouncedReportFilter] = useDebounce(reportFilter, 300);






  useEffect(() => {
    handleFetchReports();                                         // Fetch all reports
  }, [isQueue, refreshReports]);

  // useEffect(() => {
  //   window.addEventListener('keydown', addEscListener);           // Add keydown event listener to listen for Escape key press
  //   clearStorage.forEach((str) => localStorage.removeItem(str));  // Clean the local storage

  //   if(workspace == null)
  //     navigate('/error');
  // }, []);

  // Trigger the refresh of the reports
  // const triggerRefresh = () => setRefreshReports((prev) => !prev);        

  // // Fetch all reports
  const handleFetchReports = async () => {
    try {
      const [check, data] = await fetchAllReports(workspace, isQueue);
      if (check){
        setReports(data);
        // console.log(reports);
        // triggerRefresh();
      }
      else
        setError(data);
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // Function to handle card click and show modal
  const handleClickOnCard = useCallback((report) => {
    if (!isQueue) {                           // If we are not in queue page
      setReport(report);                      // Holds the selected report
      // setIsOperationModal(true);              // Show the operation modal
      };
    }, [isQueue]);

  // Function to handle sending card click and show modal
  const handleMoveWorkspaceButton = useCallback((report) => {
    setReport(report);                        // Holds the selected report
    setIsSendModalOpen(true);                 // Show the transfer modal
  }, []);

  // Function to close the modal
  const handleCloseModal = () => {
    // setIsOperationModal(false);               // Close the operation modal
    setReport(null);                          // Clear the state the holds the report
    setIsSendModalOpen(false);                // Close the transfer modal
  };

  // Add Esc press key listener
  // const addEscListener = (event) => handleEscKey(event, handleCloseModal);

  // Filtered reports
  const filteredReports = reports.filter((report) =>
    report.serialNumber.toLowerCase().includes(reportFilter.toLowerCase())
  );

    // Display loading/error state if necessary
    if (loading) return <p>Loading reports...</p>;
    if (error) return <p>Error: {error}</p>;

  return (
    <div className="dashboard-layout">
      <div className="dashboard-content">
        <div id='headerDashboard'>
          <h1>עמדת {workspaceMap[workspace]}</h1>                   {/* Label */}
          <input                                                    // Report filter
            type="text"                                             
            placeholder="פקודת עבודה לחיפוש..." 
            value={reportFilter}
            onChange={(e) => setReportFilter(e.target.value)}
            className="search-bar"
          />
        </div>
        
        {/* Container for displaying reports as cards */}
        <div className="cards-container">                               
        <TableContainer
          reports={filteredReports}
          onClickRow={handleClickOnCard}
          isQueue={isQueue}
        />
        </div>
      </div>
      
        <Slidebar 
          setIsReceived={setIsReceived}                                 // Pass setIsReceived function to Slidebar
        />

      {/* Modal for report details, only visible when isOperationModal and not in queue */}
      {/* {isOperationModal && !isQueue && 
        <OperationModal 
          onClose={addEscListener} 
          report_id={report._id} 
          report_serialNum={report.serialNumber} 
          report_packedCount={ report.packedCount } 
          report_producedCount={ report.producedCount } 
          report_orderedCount={ report.orderedCount } 
          workspace={workspace}
          setIsOperationModal={setIsOperationModal}
        />} */}

      {/* Send modal for moving reports, only visible when isSendModalOpen */}
      {isSendModalOpen && 
        <ModalTransferWorkspace 
          onClose={handleCloseModal} 
          selectedReport={report} 
          isReceived={isReceived} 
        />}

    </div>
  );
};

export default Dashboard;
