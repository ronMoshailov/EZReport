const express = require('express');
const router = express.Router();
const { getReports } = require('../controller/reportController');

router.post('/getReports', getReports);

module.exports = router;
