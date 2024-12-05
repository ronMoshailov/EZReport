
const express = require('express');
const router = express.Router();
const { isEmployeeExist, addEmployeeHandler, removeEmployeeHandler } = require('../controller/employeeController');

// GET all reports
router.post('/isEmployeeExist', isEmployeeExist);
router.post('/addEmployee', addEmployeeHandler);
router.delete('/removeEmployee/:employeeNumber', removeEmployeeHandler);

module.exports = router;
