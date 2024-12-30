const { findEmployeeByNumber, addEmployee, removeEmployee } = require('../libs/employeeLib');

// Get employee Id by employee number
const getEmployeeIdController = async (req, res) => {
  
  try {
    // Get data from the request
    const { employeeNumber } = req.body;
    
    // Check if the data is valid
    if(isNaN(employeeNumber)){
      console.error("Error in getEmployeeIdController: invalid employeeNumber");
      return res.status(400).json({message: "Employee number is not valid"});
    }

    // Get the employee
    const employee = await findEmployeeByNumber(employeeNumber);
    // Check if the employee was found
    if (!employee){
      console.error("Error in getEmployeeIdController: employee not found")
      return res.status(404).json({message: "Employee not found"});
    } 

    // Respond with HTTP 200 (OK) to indicate the request was successful
    return res.status(200).json({exist: true, id: employee._id});

  } catch (error) {
    console.error('Error in getEmployeeIdController:', error.message);
    return res.status(500).json({ message: error.message });
  }
};

// Add new employee to the DB
const addEmployeeController = async (req, res) => {

  try {
    // Get data from the request
    const { number_employee, fullName } = req.body;

    // Check if the data is valid
    if(isNaN(Number(number_employee)) || !number_employee || fullName === undefined || number_employee <= 0 ){
      if(isNaN(Number(number_employee))) 
        console.error("Error in addEmployeeController: invalid employee number");
      if(!number_employee) 
        console.error("Error in addEmployeeController: number employee is undefined");
      if(!fullName) 
        console.error("Error in addEmployeeController: fullName is undefined");
      if(number_employee <= 0) 
        console.error("Error in addEmployeeController: number_employee equal or below zero");
      return res.status(400).json({message: "Invalid parameters"});
    }

    // Try to add new employee
    const { conflict, newEmployee } = await addEmployee(number_employee, fullName);

    // Check if the employee already exist
    if (conflict){
      console.error('Error in addEmployeeController: Component already exist');
      return res.status(409).json({message: 'Component already exist'});
    }

    // Respond with HTTP 201 (Created) to indicate the resource was successfully created
    return res.status(201).json({employee: newEmployee, message: "New employee created successfully"});

  } catch (error) {
    console.error('Error in addEmployeeController:', error.message);
    return res.status(500).json({ message: error.message });
  }
};

const removeEmployeeController = async (req, res) => {

  try {
    // Get data from the request
    const { employeeNumber } = req.params;

    // Check if the data is valid
    if(isNaN(Number(employeeNumber))){
      console.error("Error in removeEmployeeController: Invalid employee number");
      return res.status(400).json({message: "Invalid parameter"});
    }

    // Try to remove the employee
    const removedEmployee = await removeEmployee(employeeNumber);

    // Check if the employee exist
    if(!removedEmployee){
      console.error("Error in removeEmployeeController: employee not found")
      return res.status(404).json({message: "Employee not found"})
    }

    // Respond with HTTP 200 (OK) to indicate the request was successful
    return res.status(200).json({message: 'Employee removed successfully'});

  } catch (error) {
    console.error('Error in removeEmployeeController:', error.message);
    return res.status(500).json({message: error.message});;
  }
};

// Export the controller functions
module.exports = { getEmployeeIdController, addEmployeeController, removeEmployeeController };
