const { findEmployeeByNumber, addEmployee, removeEmployee } = require('../libs/employeeLib');

// Getting information from DB
const getEmployeeIdController = async (req, res) => {
  try {
    const { employeeNumber } = req.body;
    if(isNaN(employeeNumber)){
      console.error("Error in isEmployeeExist: invalid employeeNumber");
      return res.status(400).json({message: "Employee number is not valid"});
    }

    const employee = await findEmployeeByNumber(employeeNumber);

    if (!employee){
      console.error("Error in isEmployeeExist: employee wasn't found")
      return res.status(404).json({message: "Employee not found"});
    } 

    return res.status(200).json({exist: true, id: employee._id});

  } catch (error) {
    console.error('Error in isEmployeeExist:', error.message);
    return res.status(500).json({ message: error.message });
  }
};

// Change information in DB
const addEmployeeController = async (req, res) => {
  try {
    const { number_employee, fullName } = req.body;
    if(isNaN(Number(number_employee)) || fullName === undefined){
      if(isNaN(Number(number_employee))) console.error("Error in addEmployeeHandler: invalid employee number");
      if(fullName === undefined) console.error("Error in addEmployeeHandler: fullName is undefined");
      return res.status(400).json({message: "Invalid parameters"});
    }

    const employee = await addEmployee(number_employee, fullName);
    return res.status(201).json({employee, message: "New employee created successfully"});
  } catch (error) {
    if (error.message === "Employee already exist"){
      console.error("Error in addEmployeeHandler: ", error.message);
      return res.status(409).json({message: error.message})
    }
    console.error('Error in addEmployeeHandler:', error.message);
    return res.status(500).json({ message: error.message });
  }
};

const removeEmployeeController = async (req, res) => {
  try {
    const { employeeNumber } = req.params;
    if(isNaN(Number(employeeNumber))){
      console.error("Error in removeEmployeeHandler: Invalid employee number");
      return res.status(400).json({message: "Invalid parameter"});
    }
    const removedEmployee = await removeEmployee(employeeNumber);
    if(!removedEmployee){
      console.error("Error in isEmployeeExist: employee wasn't found")
      return res.status(404).json({message: "Employee not found"})
    }
    return res.status(200).json({message: 'Employee removed successfully'});
  } catch (error) {
    console.error('Error in removeEmployeeHandler:', error.message);
    return res.status(500).json({message: error.message});;
  }
};

// Export the controller functions
module.exports = { getEmployeeIdController, addEmployeeController, removeEmployeeController };
