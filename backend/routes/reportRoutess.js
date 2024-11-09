const express = require('express');
const router = express.Router();
const { getReports , updateReportWorkspace, addComment, addComponents, getLastTransferDetail, toggleEnable, getReportComponents } = require('../controller/reportController');

router.post('/getReports', getReports);
router.post('/updateReportWorkspace', updateReportWorkspace);
router.post('/addTransitionBetweenStations', updateReportWorkspace);
// router.post('/getReport/:id', getReport);
// router.post('/getTransmission/:id', getTransmission);
router.post('/addComment', addComment);
router.post('/addComponents', addComponents);
router.get('/getLastTransferDetail/:report_id', getLastTransferDetail);
router.post('/toggleEnable', toggleEnable);
router.get('/getReportComponents/:report_id', getReportComponents);

module.exports = router;
