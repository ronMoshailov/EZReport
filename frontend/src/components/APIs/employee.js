
const getEmployeeId = async (inputValue) => {

    // Send a POST request to check if the employee exists
    const response = await fetch('http://localhost:5000/api/getEmployeeId', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },  // Set content type to JSON
      body: JSON.stringify({ employeeNumber: inputValue })  // Pass the input value in the request body
    });
    
    // if (response.status == '404'){
    //   return [false, 'מספר עובד לא קיים'];
    // }

    // // Check if the response is successful
    // if (!response.ok) throw new Error(`Failed to fetch employee data. Status: ${response.status}`);

    return await response.json();
}

export { getEmployeeId }
