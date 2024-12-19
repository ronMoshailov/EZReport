
const getEmployeeId = async (inputValue) => {

    // Send a POST request to check if the employee exists
    const response = await fetch('http://localhost:5000/api/getEmployeeId', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },  // Set content type to JSON
      body: JSON.stringify({ employeeNumber: inputValue })  // Pass the input value in the request body
    });
    return await response.json();
}

const addEmployee = async (employeeName, employeeNum) => {
  const response = await fetch('http://localhost:5000/api/addEmployee', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },  // Set content type to JSON
    body: JSON.stringify({ number_employee: employeeNum, fullName: employeeName })  // Pass the input value in the request body
  });
  const data = await response.json();
  return data;
}

const removeEmployee = async (employeeNum) => {
  const response = await fetch(`http://localhost:5000/api/removeEmployee/${employeeNum}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },  // Set content type to JSON
  });
  const data = await response.json();
  return data;
}

export { getEmployeeId, addEmployee, removeEmployee }
