import { print, printError } from '../functions'

const getEmployeeId = async (inputValue) => {
  try{
    // Send a POST request to check if the employee exists
    const response = await fetch('http://localhost:5000/api/getEmployeeId', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },  // Set content type to JSON
      body: JSON.stringify({ employeeNumber: inputValue })  // Pass the input value in the request body
    });

    // Check if the rqeuest succeeded
    if(!response.ok){
      if(response.status === 400)
          return [false, 'invalidParameters'];
      if(response.status === 404)
          return [false, 'employeeNotFound'];
      if(response.status === 500)
          return [false, 'serverError'];
      return [false, 'unexpectedError']
      }
      // return [false, 'employeeNotFound'];
      const data = await response.json();
    return [true, data];

  } catch (error){
    printError(`Unexpected error from the server: ${error.message}`);
    return [false, 'connectionFailed'];
  }
}

const addEmployee = async (employeeName, employeeNum) => {
  try {
    const response = await fetch('http://localhost:5000/api/addEmployee', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },  // Set content type to JSON
      body: JSON.stringify({ number_employee: employeeNum, fullName: employeeName })  // Pass the input value in the request body
    });
    print(response.status === 500)
    // Check if the rqeuest succeeded
    if(!response.ok){
      if(response.status === 400)
          return [false, 'invalidParameters'];
      if(response.status === 404)
          return [false, 'employeeNotFound'];
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
}

const removeEmployee = async (employeeNum) => {
  try {
    const response = await fetch(`http://localhost:5000/api/removeEmployee/${employeeNum}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },  // Set content type to JSON
    });

    // Check if the rqeuest succeeded
    if(!response.ok){
      if(response.status === 400)
          return [false, 'invalidParameters'];
      if(response.status === 404)
          return [false, 'employeeNotFound'];
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


}

export { getEmployeeId, addEmployee, removeEmployee }
