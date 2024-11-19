const getLastTransferDetail = async (report_id) =>{
    // Make the GET request to the server
    const response = await fetch(`http://localhost:5000/api/getLastTransferDetail/${report_id}`);

    // Check for response success
    if (!response.ok) throw new Error(`Failed to fetch last transfer detail. Status: ${response.status}`);
    
    // Parse the response data
    const data = await response.json();

    // Return the last transfer detail
    return data.lastTransferDetail;
}

const makeReceivedWorkspace = async (transferdetails_id, employee_id, current_workspace, report_id) => {
    // Make the POST request to the server
    const sendWorkspaceResponse = await fetch('http://localhost:5000/api/receivedWorkspace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transferdetails_id: transferdetails_id,
          received_worker_id: employee_id,
          received_workspace: current_workspace,
          isReceivedd: true,
          report_id: report_id
        })
      });
  
      // Check for response success
      if (!sendWorkspaceResponse.ok) throw new Error(`Failed to receive workspace data. Status: ${sendWorkspaceResponse.status}`);
}

const makeSendWorkspace = async (employee_id, current_workspace, report_id) => {
  // Make the POST request to the server
  const response = await fetch('http://localhost:5000/api/processWorkspaceTransfer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      send_worker_id: employee_id,
      send_workspace: current_workspace,
      report_id: report_id,
    }),
  });

  // Check for response success
  if (!response.ok) throw new Error(`Failed to process workspace transfer. Status: ${response.status}`);
}

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

export{ getLastTransferDetail, makeReceivedWorkspace, makeSendWorkspace, isWorkspaceExist }
