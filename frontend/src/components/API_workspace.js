const getLastTransferDetail = async (report_id) =>{
    // Make the GET request to the server
        // console.log(`try to fetch last transfer`);
        const response = await fetch(`http://localhost:5000/api/getLastTransferDetail/${report_id}`, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        },
    });
    // console.log('A.');
    // Check for successful response
    if (!response.ok) {
        throw new Error(`Failed to fetch last transfer detail. Status: ${response.status}`);
    }

    // Parse the response data
    const data = await response.json();

    // Return the last transfer detail
return data.lastTransferDetail;
}

const makeReceivedWorkspace = async (transferdetails_id, employee_id, current_workspace) => {
    const sendWorkspaceResponse = await fetch('http://localhost:5000/api/receivedWorkspace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transferdetails_id: transferdetails_id,
          received_worker_id: employee_id,
          received_workspace: current_workspace,
          isReceivedd: true
        })
      });
  
      // Check for response success
      if (!sendWorkspaceResponse.ok) {
        throw new Error(`Failed to receive workspace data. Status: ${sendWorkspaceResponse.status}`);
      }
}

const makeSenddWorkspace = async (employee_id, current_workspace) =>{
    const sendWorkspaceResponse = await fetch('http://localhost:5000/api/sendWorkspace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          send_worker_id: employee_id,
          send_workspace: current_workspace,
          isReceivedd: false
        })
      });
  
      // Check for response success
      if (!sendWorkspaceResponse.ok) {
        throw new Error(`Failed to send workspace data. Status: ${sendWorkspaceResponse.status}`);
      }
  
      // Update the current workspace in the report to the next position in the map
      return await sendWorkspaceResponse.json();
  
}

export{
    getLastTransferDetail,
    makeReceivedWorkspace
}