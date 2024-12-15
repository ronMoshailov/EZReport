/* General */

// Fetch all reports
const fetchAllReports = async (workspace, isQueue) => {
  try {
    const response = await fetch('http://localhost:5000/api/getAllReports', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ workspace, isQueue }),
    });

    const data = await response.json();

    if( response.status === 400 ) throw new Error('Bad Request: Missing or invalid parameters');
    else if( data.message === "Reports not found" ) return [true, []]
    else if( response.status === 500 ) throw new Error('Internal Server Error: Something went wrong on the server');
    else if (!response.ok) throw new Error(`Unexpected Error: Status code ${response.status}`);
    
    return [true, data];

  } catch (err) {
    return [false, err.message];
  }
};

// Start session
const startSession = async (reportId, employeeNum) => {
  try {
    const response = await fetch('http://localhost:5000/api/startSession', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ reportId, employeeNum }),
    });
    
    const data = await response.json();
    console.log(response);
    console.log(data);
    if( response.status === 400 ) throw new Error('Bad Request: Missing or invalid parameters');
    else if( response.status === 409 ) throw new Error(data.message);
    else if( response.status === 404 ) throw new Error('Not found: The requested resource could not be located on the server');
    else if( response.status === 500 ) throw new Error('Internal Server Error: Something went wrong on the server');
    else if (!response.ok) throw new Error(`Unexpected Error: Status code ${response.status}`);
    return true;
  } catch (error) {
    console.error(error.message);
    return error.message;
  }
};

// Check if there is started session
const isStartedSession = async (reportId, employeeNum) => {
  try {
    const response = await fetch('http://localhost:5000/api/isStartedSession?employeeNum=' + employeeNum + '&reportId=' + reportId);
    const data = await response.json();

    if(response.ok){
      return [true, data.reportingId];
    }
    
    switch(response.status){
      case 400:
        console.error(data.message);
        return [false, data.message === 'Employee not found' ? 'עובד לא קיים במערכת' : 'דוח לא קיים במערכת'];
      case 404:
        console.error(data.message);
        return [false, data.message === 'Employee not started a session' ? 'לא דווח על תחילת עבודה' : 'שגיאה'];
      case 500:
        console.error(data.message);
        return [false, data.message === 'Server error' ? 'שגיאה בשרת' : 'שגיאה'];
      default:
        return [false, 'שגיאה לא צפויה'];
    }

  } catch (error) {
    console.error(error.message);
    return [false, error.message];
  }
};

/* Storage */

// Fetch report's components
const fetchReportComponents = async (report_id) => {
  // Send a GET request to fetch the components associated with the specified report ID
  const response = await fetch(`http://localhost:5000/api/getReportComponents/${report_id}`, {
    method: 'GET', // HTTP method for retrieving data
    headers: {
      'Content-Type': 'application/json', // Specify that the request expects JSON responses
    },
  });

  // Check if the response status indicates failure (e.g., 4xx or 5xx)
  if (!response.ok) throw new Error(`Failed to fetch components. Status: ${response.status}`);

  // Parse the JSON response from the server
  const data = await response.json();

  // Return the parsed data to the caller
  return data;
};

// Remove component from report and update the stock
const handleRemoveComponentFromReport = async (report_id, component_id, stock) => {
  // Send a POST request to the backend to remove a component from a report and return its stock
  const removeResponse = await fetch('http://localhost:5000/api/removeComponentAndReturnToStock', {
    method: 'POST', // HTTP method for sending data to the server
    headers: { 
      'Content-Type': 'application/json' // Specify that the request body is JSON
    },
    body: JSON.stringify({
      report_id,                    // ID of the report from which the component should be removed
      component_id: component_id,   // Unique identifier (_id) of the component to be removed
      stock: stock                  // The quantity of the component to be returned to stock
    }),
  });

  // Check if the response status indicates failure
  if (!removeResponse.ok) {
    throw new Error('Failed to remove component from report in the backend.');
  }
};

// Add component list to report
const fetchAddComponents = async (employee_id, report_id, componentsToAdd, inputComment) => {
  try {
    // Send a POST request to add components to the specified report
    const response = await fetch('http://localhost:5000/api/addComponentsToReport', {
      method: 'POST', // Use POST to send data to the server
      headers: {
        'Content-Type': 'application/json', // Specify that the content type is JSON
      },
      body: JSON.stringify({
        employee_id,              // Employee ID performing the action
        report_id,                // Report ID to which components are being added
        components_list: componentsToAdd, // List of components with their details (e.g., ID and stock)
        comment: inputComment,    // Additional comment provided by the user
      }),
    });

    // Check if the response indicates a failure
    if (!response.ok) {
      throw new Error(`Failed to process the report. Status: ${response.status}`);
    }

    // Parse and return the JSON response from the server
    const data = [true, await response.json()];
    return data;
    
  } catch (error) {
    // Log any errors encountered during the request
    console.error('Error adding components to the report:', error.message);
    throw error; // Re-throw the error for further handling if needed
  }
};

/* Manager */




///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////











// const toggleReportEnable = async (report_id) => {
//   try {
//     // Send a POST request to toggle the "enable" field of a specific report
//     const response = await fetch('http://localhost:5000/api/toggleEnable', {
//       method: 'POST', // Use POST method to send data to the server
//       headers: { 
//         'Content-Type': 'application/json' // Specify JSON format for the request body
//       },
//       body: JSON.stringify({ report_id: report_id }), // Send the report ID as JSON in the request body
//     });

//     // Check if the response indicates a failure (non-2xx status code)
//     if (!response.ok) {
//       throw new Error(`Failed to toggle enable field. Status: ${response.status}`);
//     }

//     // Parse the response data to JSON
//     const data = await response.json();

//     // Optionally handle the response data (e.g., update UI or application state)
//     return data.message; // Return the message from the server
//   } catch (error) {
//     // Log any errors that occur during the request
//     console.error('Error toggling enable field:', error.message);
//   }
// };



const displayReportComments = async (report_id) =>{
  console.log('report_id');
  console.log(report_id);
  // Make a request to the API to fetch comments
  const response = await fetch(`http://localhost:5000/api/displayReportComments/${report_id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch comments: ${response.statusText}`);
  }

  // Parse the response data
  const comments = await response.json();
  // Return comments (Example: Console log or Update UI)
  return comments.comments;
}

const sendProductionReport = async (report_id, employee_id, completedCount, comment) => {
  try {
    // Send a POST request to add components to the specified report
    const response = await fetch('http://localhost:5000/api/createProductionReport', {
      method: 'POST', // Use POST to send data to the server
      headers: {
        'Content-Type': 'application/json', // Specify that the content type is JSON
      },
      body: JSON.stringify({
        report_id,              // Employee ID performing the action
        employee_id,                // Report ID to which components are being added
        completedCount, // List of components with their details (e.g., ID and stock)
        comment,    // Additional comment provided by the user
      }),
    });

    // Check if the response indicates a failure
    if (!response.ok) {
      throw new Error(`Failed to process the report. Status: ${response.status}`);
    }
    
    // Parse and return the JSON response from the server
    // return await response.json();
    return true;
  } catch (error) {
    // Log any errors encountered during the request
    console.error('Error adding components to the report:', error.message);
    throw error; // Re-throw the error for further handling if needed
  }
};

const CloseProductionReporting = async (employeeNum, reportId, completed, comment) => {
  try {
    // Send a POST request to add components to the specified report
    const response = await fetch('http://localhost:5000/api/CloseProductionReporting', {
      method: 'POST', // Use POST to send data to the server
      headers: {
        'Content-Type': 'application/json', // Specify that the content type is JSON
      },
      body: JSON.stringify({
        employeeNum,              // Employee ID performing the action
        reportId,                // Report ID to which components are being added
        completed, // List of components with their details (e.g., ID and stock)
        comment,    // Additional comment provided by the user
      }),
    });

    // Check if the response indicates a failure
    if (!response.ok) {
      throw new Error(`Failed to process the report. Status: ${response.status}`);
    }
    
    // Parse and return the JSON response from the server
    // return await response.json();
    return true;
  } catch (error) {
    // Log any errors encountered during the request
    console.error('Error adding components to the report:', error.message);
    throw error; // Re-throw the error for further handling if needed
  }
}

const ClosePackingReporting = async (employeeNum, reportId, completed, comment) => {
  try {
    // Send a POST request to add components to the specified report
    const response = await fetch('http://localhost:5000/api/ClosePackingReporting', {
      method: 'POST', // Use POST to send data to the server
      headers: {
        'Content-Type': 'application/json', // Specify that the content type is JSON
      },
      body: JSON.stringify({
        employeeNum,              // Employee ID performing the action
        reportId,                // Report ID to which components are being added
        completed, // List of components with their details (e.g., ID and stock)
        comment,    // Additional comment provided by the user
      }),
    });

    // Check if the response indicates a failure
    if (!response.ok) {
      throw new Error(`Failed to process the report. Status: ${response.status}`);
    }
    
    // Parse and return the JSON response from the server
    // return await response.json();
    return true;
  } catch (error) {
    // Log any errors encountered during the request
    console.error('Error adding components to the report:', error.message);
    throw error; // Re-throw the error for further handling if needed
  }
}

export { fetchAllReports, 
  fetchReportComponents, 
  handleRemoveComponentFromReport, 
  // toggleReportEnable, 
  fetchAddComponents, 
  displayReportComments, 
  sendProductionReport, 
  startSession,
  isStartedSession,
  CloseProductionReporting,
  ClosePackingReporting
 };



