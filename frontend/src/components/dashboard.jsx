import React, { useState, useEffect } from 'react';
import Card from './card';
import Slidebar from './slidebar';  // Import the sidebar component
import './dashboard.scss'; // Import the dashboard styles
import './slidebar.scss';  // Import the sidebar styles

const Dashboard = () => {

    // Step 1: Define state to hold the reports data
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

  // Step 2: Fetch data from the backend when the component mounts
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/reports'); // Make sure this URL matches your backend server
        if (!response.ok) {
          throw new Error('Failed to fetch reports');
        }
        console.log('data recieved to frontend');
        const data = await response.json();
        console.log('data as json: ' + data);
        setReports(data); // Set the reports data
        setLoading(false); // Mark loading as false
      } catch (err) {
        setError(err.message);
        setLoading(false); // Mark loading as false
      }
    };

    fetchReports(); // Call the function to fetch data
  }, []); // Empty dependency array means this runs once when the component mounts

  // Step 3: Display loading/error state if necessary
  if (loading) return <p>Loading reports...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="layout">
      {/* Main dashboard content */}
      <div className="dashboard-content">
        <h1>Employee Dashboard</h1>
        <div className="cards-container">
          {/* Step 4: Map through the reports and create a Card for each report */}
          {reports.map(report => (
            <Card
              key={report.id} // Use a unique key for each element
              numberOperation={report.product_num} // Pass product number
              name={report.product_name} // Pass product name
              date={new Date(report.openDate).toLocaleDateString()} // Format and pass the date
              employeeNumber={report.employeeNumber || 'N/A'} // Add other report data as needed
            />
          ))}
        </div>
      </div>

      {/* Sidebar on the right */}
      <div className="sidebar">
        <Slidebar />
      </div>
    </div>
  );
};

export default Dashboard;
