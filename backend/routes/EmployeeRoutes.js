
const express = require('express');
const router = express.Router();
const isEmployeeExist = require('../controller/employeeController');

// GET all reports
router.post('/isEmployeeExist', isEmployeeExist);
// router.get('/check-employee-number/:number', isEmployeeExist);

module.exports = router;
