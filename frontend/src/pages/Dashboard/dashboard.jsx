// Import React libraries
import React, { useState, useEffect, useContext } from 'react'; 
import { useNavigate } from 'react-router-dom';

// Import scss
import './dashboard.scss';

// Import API
import { fetchAllReportsByWorkspace } from '../../utils/APIs/report';

// import context
import { LanguageContext } from '../../utils/languageProvider';

// Import components
import TableContainer from '../../components/TableContainer/tableContainer';
import Slidebar from '../../components/Slidebar/slidebar';

// Import functions
import { resetLocalStorageDashboard } from '../../utils/functions';

// Dashboard component
const Dashboard = ({isQueue}) => {

  // States
  const [reports, setReports] = useState([]);                                             // Holds all the reports
  const [loading, setLoading] = useState(true);                                           // Is loading state
  const [error, setError] = useState(null);                                               // Holds error message
  const [reportFilter, setReportFilter] = useState('');                                   // Filter text for reports
  const [refreshReports, setRefreshReports] = useState(false);

  // Constant variables
  const workspace = localStorage.getItem('workspace');

  // useContext
  const { direction, text } = useContext(LanguageContext);
  
  // useNavigate
  const navigate = useNavigate();

  // useEffect for initialized component
  useEffect(() => {
    if(workspace == null)
      navigate('/error');
    resetLocalStorageDashboard();
  }, []);

  // useEffect for changing queue
  useEffect(() => {
    handleFetchReports();                                         // Fetch all reports
  }, [isQueue]);

  // useEffect for refresh reports
  useEffect(() => {
    handleFetchReports();                                         // Fetch all reports
  }, [refreshReports]);

  // // Fetch all reports
  const handleFetchReports = async () => {
    try {
      const [check, data] = await fetchAllReportsByWorkspace(workspace, isQueue);
      if (check)
        setReports(data);
      else
        setError(text[data]);
    } catch (err) {
      setError(err.message);
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

  // Render
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
          isQueue={isQueue}
          setRefreshReports={setRefreshReports}
        />
        </div>
      </div>
      <Slidebar/>
    </div>
  );
};

// Export component
export default Dashboard;
