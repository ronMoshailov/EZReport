import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import TableContainer from '../../components/TableContainer/tableContainer';
import Slidebar from '../../components/Slidebar/slidebar';

import './dashboard.scss';
import '../../components/Slidebar/slidebar.scss';

// import { handleEscKey } from '../../utils/functions';
import { fetchAllReportsByWorkspace } from '../../components/APIs/report';

import { LanguageContext } from '../../utils/globalStates';

const Dashboard = ({isQueue}) => {

  // States
  const [reports, setReports] = useState([]);                                             // Holds all the reports
  const [report, setReport] = useState(null);                                             // Holds specific report
  const [loading, setLoading] = useState(true);                                           // Is loading state
  const [error, setError] = useState(null);                                               // Holds error message
  const [isReceived, setIsReceived] = useState(false);                                    // Tetermine if client receiving report or send report
  const [reportFilter, setReportFilter] = useState('');                                   // Filter text for reports

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

    const { direction, text } = useContext(LanguageContext);
  



  const navigate = useNavigate();
  // const [debouncedReportFilter] = useDebounce(reportFilter, 300);






  useEffect(() => {
    handleFetchReports();                                         // Fetch all reports
  }, [isQueue]);

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
      const [check, data] = await fetchAllReportsByWorkspace(workspace, isQueue);
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
    <div className="dashboard-layout"  style={{ direction }}>
      <div className="dashboard-content">
        <div id='headerDashboard'>
          {console.log(workspace.toLowerCase())}
          {console.log(text[workspace.toLowerCase()])}
          {console.log(text)}
          <h1>{`${text.station} ${text[workspace.toLowerCase()]}`}</h1>                   {/* Label */}
          <input                                                    // Report filter
            type="text"                                             
            placeholder={text.dashboardFilter} 
            value={reportFilter}
            onChange={(e) => setReportFilter(e.target.value)}
            className="search-bar"
          />
        </div>
        
        {/* Container for displaying reports as cards */}
        <div className="table-container-wrapper">                               
        <TableContainer
          reports={filteredReports}
          // onClickRow={handleClickOnCard}
          isQueue={isQueue}
        />
        </div>
      </div>
      
      <Slidebar 
        setIsReceived={setIsReceived}                                 // Pass setIsReceived function to Slidebar
      />

    </div>
  );
};

export default Dashboard;
