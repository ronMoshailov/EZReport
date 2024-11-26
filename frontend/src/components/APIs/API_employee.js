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
    
    if (response.status == '404'){
      return [false, 'מספר עובד לא קיים'];
    }

    // Check if the response is successful
    if (!response.ok) throw new Error(`Failed to fetch employee data. Status: ${response.status}`);

    return await response.json();
}

export { isEmployeeExist }
