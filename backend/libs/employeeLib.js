const Employee = require('../model/Employee');

// Find employee by employee number (called by controller)
const findEmployeeByNumber = async (employeeNum, session) => {
  try {
    const employee = await Employee.findOne({ number_employee: employeeNum }).session(session);
    return employee;
  } catch (error) {
    console.error('Error in findEmployeeByNumber:', error.message);
    throw error;
  }
};

const findEmployeeById = async (employeeId, session) => {
  try {
    const employee = await Employee.findById(employeeId).session(session);
    return employee;
  } catch (error) {
    console.error('Error in findEmployeeById:', error.message);
    throw error;
  }
};

// Change information in DB (called by controller)
const addEmployee = async (number_employee, fullName) => {
  try {
    // Check if the employee already exist
    const existingEmployee = await findEmployeeByNumber(number_employee);

    // If exist
    if(existingEmployee) 
      return {conflict: true, employee: existingEmployee}
    
    // Create new employee in the DB
    const newEmployee = new Employee({number_employee, fullName});
    await newEmployee.save();

    // Return the new employee
    return {conflict: false, employee: newEmployee};

  } catch (error) {
    console.error("Error in findEmployeeById:", error.message);
    throw new Error('Failed to add employee');
  }
};

// Remove employee from the DB (called by controller)
const removeEmployee = async (employeeNumber) => {
  try {
    const result = await Employee.findOneAndDelete({ number_employee: employeeNumber });
    return result;
  } catch (error) {
    console.error('Error in removeEmployee:', error.message);
    throw new Error('Failed to remove employee');
  }
};

module.exports = { findEmployeeByNumber, addEmployee, removeEmployee, findEmployeeById };
