
const express = require('express');
const router = express.Router();
const { getEmployeeIdController, addEmployeeController, removeEmployeeController } = require('../controller/employeeController');

// GET all reports
router.post('/getEmployeeId', getEmployeeIdController);
router.post('/addEmployee', addEmployeeController);
router.delete('/removeEmployee/:employeeNumber', removeEmployeeController);

module.exports = router;
