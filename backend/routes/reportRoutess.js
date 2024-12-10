const express = require('express');
const router = express.Router();
const { getAllReports, addComponentsToReport, getReportComponents, removeComponentAndReturnToStock, transferWorkspace, getReportComments, reportingProductionController, reportingPackingController, startSession, isStartedSessionController } = require('../controller/reportController');

router.post('/getAllReports', getAllReports);
router.post('/removeComponentAndReturnToStock', removeComponentAndReturnToStock);
router.post('/addComponentsToReport', addComponentsToReport);
router.get('/getReportComponents/:report_id', getReportComponents);
router.get('/displayReportComments/:report_id', getReportComments);
router.post('/transferWorkspace', transferWorkspace);
router.post('/postProductionReporting', reportingProductionController);
router.post('/postPackingReporting', reportingPackingController);
router.post('/startSession', startSession);
router.get('/isStartedSession', isStartedSessionController);

module.exports = router;
