const Employee = require('../model/Employee');

// Find employee by ID
const findEmployeeById = async (employeeId) => {
  if (!employeeId) throw new Error('Employee ID is required');
  return await Employee.findOne({ number_employee: employeeId });
};

const addEmployee = async (employeeData) => {
  try {
    const employee = new Employee(employeeData);
    await employee.save();
    return true;
  } catch (error) {
    console.error('Error in addEmployee:', error.message);
    throw new Error('Failed to add employee');
  }
};

const removeEmployee = async (employeeNumber) => {
  try {
    const result = await Employee.findOneAndDelete({ number_employee: employeeNumber });
    if (!result) throw new Error('Employee not found');
    return true;
  } catch (error) {
    console.error('Error in removeEmployee:', error.message);
    throw new Error('Failed to remove employee');
  }
};

module.exports = { findEmployeeById, addEmployee, removeEmployee };
