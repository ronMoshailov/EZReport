const Employee = require('../model/Employee');

// Find employee by ID
const findEmployeeById = async (employeeId) => {
  if (!employeeId) throw new Error('Employee ID is required');
  return await Employee.findOne({ number_employee: employeeId });
};

module.exports = { findEmployeeById };
