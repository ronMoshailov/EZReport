const Employee = require('../model/Employee');

const isEmployeeExist = async (req, res) => {
  const employeeID = req.body.data;  // Get position from the request body
  console.log('Employee id that received in router: ' + employeeID);

  if (!employeeID && employeeID !== 0) {
    console.log('Employee ID is missing or invalid.');
    return res.status(400).json({ exist: false });  // Stop further execution by returning
  }

  try {
    console.log('Trying to find the employee..');
    const returnedEmployee = await Employee.find({ number_employee: employeeID });
    console.log('Returned Employee: ' + returnedEmployee);

    if (returnedEmployee.length === 0) {
      console.log('No employee found with this number.');
      return res.status(404).json({ exist: false });
    }

    res.status(200).json({ exist: true, employee: returnedEmployee });
    console.log('The employee was sent back.');
  } catch (err) {
    console.error('Error querying the database:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Export the controller functions
module.exports = isEmployeeExist;
