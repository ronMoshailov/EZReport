const express = require('express');
const router = express.Router();
const { getReports , updateReportStation , getReport , getTransmission} = require('../controller/reportController');

router.post('/getReports', getReports);
router.post('/updateReportStation', updateReportStation);
router.post('/addTransitionBetweenStations', updateReportStation);
router.post('/getReport/:id', getReport);
router.post('/getTransmission/:id', getTransmission);

module.exports = router;
