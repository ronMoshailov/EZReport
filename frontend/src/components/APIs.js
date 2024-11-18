/* Worked */























// Is workspace exist
const isWorkspaceExist = async (workspace) => {
    // Make server request to check if workspace exists
    try {
        const response = await fetch(`http://localhost:5000/api/isWorkspaceExist/${workspace}`);
        
        if (response.ok) {                                  // Server returned 200 status
            const workspace_data = await response.json();   
            
            if (workspace_data !== undefined) {             // Workspace exists on server
                return [true, workspace_data.name];
            } else {
                return [false, 'מספר עמדה לא קיים'];
            }
        } else {                                            // Server returned non-200 status
            return [false, 'שגיאה בבדיקה'];
        }
    } catch (error) {                                       // Network or server error occurred
        return [false, 'החיבור לשרת לא הצליח'];
    }
}

const fetchAllReports = async (workspace, isQueue) => {
    try {
        console.log(`workspace ${workspace}, isQueue: ${isQueue}`);
        // Send POST request to fetch reports based on `workspace` and `isQueue` state
        const response = await fetch('http://localhost:5000/api/getAllReports', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ workspace, isQueue })
        });

        // Check if response is successful, throw error if not
        if (!response.ok) throw new Error('שדכשכ');

        // Parse response data and update state
        const data = await response.json();
        return [true, data];

      } catch (err) {
        return [false, err.message];
      }
}


// Fetch all components from MongoDB
const fetchAllComponents = async () => {
try {

    const response = await fetch('http://localhost:5000/api/getAllComponent');   // Send a GET request to fetch components data from the server
    const data = await response.json();                                     // Parse the JSON response
    return [true, data];

} catch (err) {
    return [false, err.message];
}
};

const fetchReportComponents = async (report_id) => {
    // Fetch the components of the report
    const response = await fetch(`http://localhost:5000/api/getReportComponents/${report_id}`, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    },
    });

    // Check if the response status is not OK
    if (!response.ok) {
    throw new Error(`Failed to fetch components. Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
}

const handleRemoveComponentFromReport = async (report_id, component_id, stock) => {
    // Send a request to the backend to remove the component from the report
    const removeResponse = await fetch('http://localhost:5000/api/removeComponentAndReturnToStock', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        report_id,                 // Report ID
        component_id: component_id, // Use the component's _id
        stock: stock
    }),
    });

    if (!removeResponse.ok) {
    throw new Error('Failed to remove component from report in the backend.');
    }
}

const isEmployeeExist = async (inputValue) => {
    // Check if inputValue is not empty
    if (!inputValue) {
      console.error("Employee number is empty.");
      return { exist: false, undefined };
    }

    // Send a POST request to check if the employee exists
    const response = await fetch('http://localhost:5000/api/isEmployeeExist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },  // Set content type to JSON
      body: JSON.stringify({ data: inputValue })  // Pass the input value in the request body
    });

    // Check if the response is successful
    if (!response.ok) throw new Error(`Failed to fetch employee data. Status: ${response.status}`);

    return await response.json();
}

const toggleReportEnable = async (report_id) => {
    try {
      // Send a POST request to toggle the enable field
      const response = await fetch('http://localhost:5000/api/toggleEnable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ report_id: report_id }), // Include the report ID in the request body
      });
  
      // Check if the response is successful
      if (!response.ok) {
        throw new Error(`Failed to toggle enable field. Status: ${response.status}`);
      }
  
      // Parse the response data
      const data = await response.json();
  
      // Optionally update the client-side state or UI here
      return data.message;
    } catch (error) {
      console.error('Error toggling enable field:', error.message);
    }
  };

const fetchAndComponents = async (employee_id, report_id, componentsToAdd, inputComment) => {
  // Send the data to the backend

  const response = await fetch('http://localhost:5000/api/addComponentsToReport', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ employee_id, report_id, components_list: componentsToAdd, comment: inputComment }),
  });

  if (!response.ok) throw new Error('Failed to process the report.');

  return await response.json();
  
}

const processWorkspaceTransfer = async () => {

  // Send the data to the backend

  const response = await fetch('http://localhost:5000/api/processWorkspaceTransfer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ employee_id, report_id, components_list: componentsToAdd, comment: inputComment }),
  });

  if (!response.ok) throw new Error('Failed to process the report.');

  return await response.json();
}

export {fetchAllReports, 
    isWorkspaceExist, 
    fetchAllComponents, 
    fetchReportComponents, 
    // handleAddReportStorage, 
    // handleAddComment, 
    // handleDecreaseStock, 
    // handleAddComponents, 
    // handleAddBackToStock,
    handleRemoveComponentFromReport,
    isEmployeeExist,
    toggleReportEnable,
    fetchAndComponents,
    processWorkspaceTransfer
};