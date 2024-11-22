const express = require('express');
const router = express.Router();
const { getAllReports, addComponentsToReport, getLastTransferDetail, getReportComponents, removeComponentAndReturnToStock, processWorkspaceTransfer, getReportComments } = require('../controller/reportController');

router.post('/getAllReports', getAllReports);
// router.post('/updateReportWorkspace', updateReportWorkspaceController);
// router.post('/addTransitionBetweenStations', updateReportWorkspace);
// router.post('/getReport/:id', getReport);
// router.post('/getTransmission/:id', getTransmission);
// router.post('/addComment', addComment);
// router.post('/addComponents', addComponents);
router.get('/getLastTransferDetail/:report_id', getLastTransferDetail);
// router.post('/toggleEnable', toggleEnable);
router.get('/getReportComponents/:report_id', getReportComponents);
router.post('/removeComponentAndReturnToStock', removeComponentAndReturnToStock);
router.post('/addComponentsToReport', addComponentsToReport);
router.post('/processWorkspaceTransfer', processWorkspaceTransfer);
// router.post('/handleReportAndComponents', handleReportAndComponents);
// router.post('/addStorageReport', addStorageReport);
router.get('/displayReportComments/:report_id', getReportComments);

module.exports = router;
