import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import TableContainer from '../../components/TableContainer/tableContainer';
import Slidebar from '../../components/Slidebar/slidebar';

import './dashboard.scss';
import '../../components/Slidebar/slidebar.scss';

import { fetchAllReportsByWorkspace } from '../../utils/APIs/report';

import { LanguageContext } from '../../utils/globalStates';

const Dashboard = ({isQueue}) => {

  // States
  const [reports, setReports] = useState([]);                                             // Holds all the reports
  const [loading, setLoading] = useState(true);                                           // Is loading state
  const [error, setError] = useState(null);                                               // Holds error message
  const [isReceived, setIsReceived] = useState(false);                                    // Tetermine if client receiving report or send report
  const [reportFilter, setReportFilter] = useState('');                                   // Filter text for reports
  const [refreshReports, setRefreshReports] = useState(false);

  // Constant variables
  const workspace = localStorage.getItem('workspace');

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

  useEffect(() => {
    handleFetchReports();                                         // Fetch all reports
  }, [isQueue]);

  useEffect(() => {
    handleFetchReports();                                         // Fetch all reports
  }, [refreshReports]);

  useEffect(() => {
  //   clearStorage.forEach((str) => localStorage.removeItem(str));  // Clean the local storage

    if(workspace == null)
      navigate('/error');
  }, []);

  // // Fetch all reports
  const handleFetchReports = async () => {
    try {
      const [check, data] = await fetchAllReportsByWorkspace(workspace, isQueue);
      if (check)
        setReports(data);
      else
        setError(data);
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

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
          setRefreshReports={setRefreshReports}
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
