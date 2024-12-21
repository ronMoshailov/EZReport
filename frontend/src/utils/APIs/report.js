import { print, printError } from '../functions'

// Fetch all reports by workspace
const fetchAllReportsByWorkspace = async (workspace, isQueue) => {
  try {
    const response = await fetch('http://localhost:5000/api/getAllReportsByWorkspace', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workspace, isQueue }),
    });

    // Check if the rqeuest succeeded
    if(!response.ok){
      if(response.status === 500)
          return [false, 'serverError'];
      return [false, 'unexpectedError']
      }

    const data = await response.json();

    return [true, data.reports];

  } catch (error) {
    printError(`Unexpected error from the server: ${error.message}`);
    return [false, 'connectionFailed'];
}
};

// Fetch all reports
const fetchAllReports = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/getAllReports');

    if(!response.ok){
      if(response.status === 500)
          return [false, 'serverError'];
      return [false, 'unexpectedError']
      }

    const data = await response.json();
    
    return [true, data];

  } catch (error) {
    printError(`Unexpected error from the server: ${error.message}`);
    return [false, 'connectionFailed'];
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

    // Check if the rqeuest succeeded
    if(!response.ok){
      if(response.status === 400)
          return [false, 'invalidParameters'];
      if(response.status === 404){
        print(data.message);
        return [false, 'reportOrEmployeeNotFound'];
      }
      if(response.status === 409)
        return [false, 'employeeStartedReporting'];
      if(response.status === 500)
          return [false, 'serverError'];
      return [false, 'unexpectedError']
    }
    
    return [true, data.message];
    
  } catch (error) {
    printError(`Unexpected error from the server: ${error.message}`);
    return [false, 'connectionFailed'];
  }
};

/* Storage */

// Fetch report's components
const fetchReportComponents = async (report_id) => {
  try {
    const response = await fetch(`http://localhost:5000/api/getReportComponents/${report_id}`, {
      method: 'GET', // HTTP method for retrieving data
      headers: {
        'Content-Type': 'application/json', // Specify that the request expects JSON responses
      },
    });

    // Check if the rqeuest succeeded
    if(!response.ok){
      if(response.status === 404)
          return [false, 'reportNotFound'];
      if(response.status === 500)
          return [false, 'serverError'];
      return [false, 'unexpectedError']
    }

    const data = await response.json();

    return [true, data];

  } catch (error) {
    printError(`Unexpected error from the server: ${error.message}`);
    return [false, 'connectionFailed'];
  }
};

// Remove component from report and update the stock
const handleRemoveComponentFromReport = async (report_id, component_id, stock) => {
  try {
      // Send a POST request to the backend to remove a component from a report and return its stock
  const response = await fetch('http://localhost:5000/api/removeComponentAndReturnToStock', {
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

  if(!response.ok){
    if(response.status === 400)
        return [false, 'invalidParameters'];
    if(response.status === 404)
      return [false, 'reportNotFound'];
    if(response.status === 500)
        return [false, 'serverError'];
    return [false, 'unexpectedError']
  }

  const data = await response.json();
  return [true, data.stock];

  } catch (error) {
    printError(`Unexpected error from the server: ${error.message}`);
    return [false, 'connectionFailed'];
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

    // Check if the rqeuest succeeded
    if(!response.ok){
      if(response.status === 400)
          return [false, 'invalidParameters'];
      if(response.status === 404){
        print(data.message);
        return [false, 'reportOrEmployeeNotFound'];
      }
      if(response.status === 409)
        return [false, 'employeeStartedReporting'];
      if(response.status === 500)
          return [false, 'serverError'];
      return [false, 'unexpectedError']
    }

    // Parse and return the JSON response from the server
    const data = await response.json();
    return [true, data];
    
  } catch (error) {
    printError(`Unexpected error from the server: ${error.message}`);
    return [false, 'connectionFailed'];
  }
};

/* Manager */
const calcAverage = async (serialNum) => {
  
  try {
    // Send a POST request to add components to the specified report
    const response = await fetch(`http://localhost:5000/api/calcAverageTimePerProductController/${serialNum}`, {
      method: 'POST',
    });
    
    // Check if the rqeuest succeeded
    if(!response.ok){
      if(response.status === 400)
          return [false, 'invalidParameters'];
      if(response.status === 404)
        return [false, 'reportOrSerialNumNotFound'];
      if(response.status === 500)
          return [false, 'serverError'];
      return [false, 'unexpectedError']
    }

    // Parse and return the JSON response from the server
    const data = await response.json();
    return [true, data];
    
  } catch (error) {
    printError(`Unexpected error from the server: ${error.message}`);
    return [false, 'connectionFailed'];
  }
}

const displayReportComments = async (report_id) =>{
  try {
    // Make a request to the API to fetch comments
    const response = await fetch(`http://localhost:5000/api/displayReportComments/${report_id}`);

      // Check if the rqeuest succeeded
      if(!response.ok){
        if(response.status === 400)
            return [false, 'invalidParameters'];
        if(response.status === 404)
          return [false, 'reportNotFound'];
        if(response.status === 500)
            return [false, 'serverError'];
        return [false, 'unexpectedError']
      }
    
    // Parse the response data
    const data = await response.json();
    print(data.comments);
    return [true, data.comments];
    
  } catch (error) {
    printError(`Unexpected error from the server: ${error.message}`);
    return [false, 'connectionFailed'];
  }
}

// I thubj I don't need this so instead of delete I comment it
// const sendProductionReport = async (report_id, employee_id, completedCount, comment) => {
//   try {
//     // Send a POST request to add components to the specified report
//     const response = await fetch('http://localhost:5000/api/createProductionReport', {
//       method: 'POST', // Use POST to send data to the server
//       headers: {
//         'Content-Type': 'application/json', // Specify that the content type is JSON
//       },
//       body: JSON.stringify({
//         report_id,              // Employee ID performing the action
//         employee_id,                // Report ID to which components are being added
//         completedCount, // List of components with their details (e.g., ID and stock)
//         comment,    // Additional comment provided by the user
//       }),
//     });

//     // Check if the response indicates a failure
//     if (!response.ok) {
//       throw new Error(`Failed to process the report. Status: ${response.status}`);
//     }
    
//     // Parse and return the JSON response from the server
//     // return await response.json();
//     return true;
//   } catch (error) {
//     // Log any errors encountered during the request
//     console.error('Error adding components to the report:', error.message);
//     throw error; // Re-throw the error for further handling if needed
//   }
// };

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

      // Check if the rqeuest succeeded
      if(!response.ok){
        if(response.status === 400)
            return [false, 'invalidParameters'];
        if(response.status === 404)
          return [false, 'reportNotFound'];
        if(response.status === 500)
            return [false, 'serverError'];
        return [false, 'unexpectedError']
      }
    
    // Parse and return the JSON response from the server
    // return await response.json();
    return [true, ''];
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
      // Check if the rqeuest succeeded
      if(!response.ok){
        if(response.status === 400)
            return [false, 'invalidParameters'];
        if(response.status === 404)
          return [false, 'reportNotFound'];
        if(response.status === 500)
            return [false, 'serverError'];
        return [false, 'unexpectedError']
      }
    
    // Parse and return the JSON response from the server
    // return await response.json();
    return [true, ''];
  } catch (error) {
    // Log any errors encountered during the request
    console.error('Error adding components to the report:', error.message);
    throw error; // Re-throw the error for further handling if needed
  }
}

export { 
  fetchAllReportsByWorkspace, 
  fetchAllReports,
  startSession,
  fetchReportComponents, 
  handleRemoveComponentFromReport, 
  fetchAddComponents, 
  calcAverage,
  displayReportComments,
  CloseProductionReporting,
  ClosePackingReporting,
 };



