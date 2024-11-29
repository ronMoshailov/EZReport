const { findEmployeeById } = require('../libs/employeeLib');

const isEmployeeExist = async (req, res) => {
  try {
    const employee = await findEmployeeById(req.body.data);

    if (!employee) {
      return res.status(404).json({ exist: false });
    }

    return res.status(200).json({ exist: true, employee });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Export the controller functions
module.exports = isEmployeeExist;
