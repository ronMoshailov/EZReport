import {print, printError } from '../functions'

const isWorkspaceExist = async (workspace) => {
  // Make server request to check if workspace exists
  try {
      const response = await fetch(`http://localhost:5000/api/isWorkspaceExist/${workspace}`);
      
      // Check if the rqeuest succeeded
      if(!response.ok){
        if(response.status === 404)
            return [false, 'workspaceNotFound'];
        if(response.status === 500)
            return [false, 'serverError'];
        return [false, 'unexpectedError']
        }
      
        const data = await response.json();
        return [true, data.workspace.name];


  } catch (error) {                                       // Network or server error occurred
    printError(`Unexpected error from the server: ${error.message}`);
    return [false, 'connectionFailed'];
  }
}

const sendReport = async (reportId, employeeNum ) => {
  try {
    const response = await fetch('http://localhost:5000/api/transferWorkspace', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        employeeNum,
        reportId
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
      else{
        return true;
      }


  } catch (error) {
    printError(`Unexpected error from the server: ${error.message}`);
    return [false, 'connectionFailed'];
  }
}



export{ isWorkspaceExist, sendReport }
