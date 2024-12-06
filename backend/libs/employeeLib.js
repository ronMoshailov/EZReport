const Employee = require('../model/Employee');

const findEmployee = async (employeeNum) => {
  return await Employee.findOne({ number_employee: employeeNum });
};

const addEmployee = async (number_employee, fullName) => {
  try {
    const isExist = await findEmployee(number_employee);
    if(isExist) throw new Error("Employee already exist");
      
    const employee = new Employee({number_employee, fullName});
    await employee.save();
    return employee;
  } catch (error) {
    if(error.message === "Employee already exist") throw error
    
    console.error("Error in addEmployee:", error.message);
    throw new Error('Failed to add employee');
  }
};

const removeEmployee = async (employeeNumber) => {
  try {
    const result = await Employee.findOneAndDelete({ number_employee: employeeNumber });
    return result;
  } catch (error) {
    console.error('Error in removeEmployee:', error.message);
    throw new Error('Failed to remove employee');
  }
};

module.exports = { findEmployee, addEmployee, removeEmployee };
