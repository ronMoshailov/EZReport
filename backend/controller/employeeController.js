const { findEmployeeById, addEmployee, removeEmployee } = require('../libs/employeeLib');

const isEmployeeExist = async (req, res) => {
  try {
    const { data: employeeNumber } = req.body;
    const employee = await findEmployeeById(employeeNumber);

    if (!employee) return res.status(404).send();
    res.status(200).send();
  } catch (err) {
    res.status(500).send();
  }
};

const addEmployeeHandler = async (req, res) => {
  try {
    const employeeData = req.body;
    await addEmployee(employeeData);
    res.status(201).send();
  } catch (error) {
    res.status(400).send();
  }
};

const removeEmployeeHandler = async (req, res) => {
  try {
    const { employeeNumber } = req.params;
    await removeEmployee(parseInt(employeeNumber));
    res.status(200).send();
  } catch (error) {
    res.status(404).send();;
  }
};

// Export the controller functions
module.exports = { isEmployeeExist, addEmployeeHandler, removeEmployeeHandler };
