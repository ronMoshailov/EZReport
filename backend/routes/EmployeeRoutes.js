
const express = require('express');
const router = express.Router();

const { getEmployeeIdController, 
    addEmployeeController, 
    removeEmployeeController 
} = require('../controller/employeeController');

router.post('/getEmployeeId', getEmployeeIdController);
router.post('/addEmployee', addEmployeeController);
router.delete('/removeEmployee/:employeeNumber', removeEmployeeController);

module.exports = router;
