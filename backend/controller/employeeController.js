const Employee = require('../model/Employee');

const isEmployeeExist = async (req, res) => {
  const employeeID = req.body.data;  // Get position from the request body
  console.log('Employee id that recieved in router: ' + employeeID);
  try {
    console.log('Trying to find the employee..');
    const returnedEmployee = await Employee.find({ number_employee: employeeID });
    console.log('ReturnedEmployee: ' + returnedEmployee);
    res.status(200).json(returnedEmployee);
    console.log('The employee was sent back.');
} catch (err) {
    res.status(500).json({ message: err.message });
  }
}


// Export the controller functions
module.exports = isEmployeeExist;

