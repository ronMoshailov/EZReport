const fetchAllReports = async (workspace, isQueue) => {
  try {
    // Send a POST request to fetch reports based on the provided `workspace` and `isQueue` values
    const response = await fetch('http://localhost:5000/api/getAllReports', {
      method: 'POST', // HTTP method for sending data to the server
      headers: {
        'Content-Type': 'application/json', // Specify that the request body is in JSON format
      },
      body: JSON.stringify({ workspace, isQueue }) // Include the request payload as a JSON string
    });

    // Check if the response status is not OK (e.g., 4xx or 5xx), throw an error
    if (!response.ok) throw new Error('Failed to fetch reports'); 

    // Parse the JSON response from the server
    const data = await response.json();

    // Return success indicator and the fetched data
    return [true, data];

  } catch (err) {
    // Return failure indicator and the error message
    return [false, err.message];
  }
};

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

const toggleReportEnable = async (report_id) => {
  try {
    // Send a POST request to toggle the "enable" field of a specific report
    const response = await fetch('http://localhost:5000/api/toggleEnable', {
      method: 'POST', // Use POST method to send data to the server
      headers: { 
        'Content-Type': 'application/json' // Specify JSON format for the request body
      },
      body: JSON.stringify({ report_id: report_id }), // Send the report ID as JSON in the request body
    });

    // Check if the response indicates a failure (non-2xx status code)
    if (!response.ok) {
      throw new Error(`Failed to toggle enable field. Status: ${response.status}`);
    }

    // Parse the response data to JSON
    const data = await response.json();

    // Optionally handle the response data (e.g., update UI or application state)
    return data.message; // Return the message from the server
  } catch (error) {
    // Log any errors that occur during the request
    console.error('Error toggling enable field:', error.message);
  }
};

const fetchAndComponents = async (employee_id, report_id, componentsToAdd, inputComment) => {
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
    return await response.json();
  } catch (error) {
    // Log any errors encountered during the request
    console.error('Error adding components to the report:', error.message);
    throw error; // Re-throw the error for further handling if needed
  }
};

const displayReportComments = async (report_id) =>{
  // Make a request to the API to fetch comments
  const response = await fetch(`http://localhost:5000/api/displayReportComments/${report_id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch comments: ${response.statusText}`);
  }

  // Parse the response data
  const comments = await response.json();

  // Return comments (Example: Console log or Update UI)
  return comments;
}

export { fetchAllReports, fetchReportComponents, handleRemoveComponentFromReport, toggleReportEnable, fetchAndComponents, displayReportComments };
