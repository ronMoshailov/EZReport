const express = require('express');
const router = express.Router();
const { getAllReports, addComponentsToReport, getReportComponents, removeComponentAndReturnToStock, transferWorkspace, getReportComments, reportingProductionController, reportingPackingController, startSession, isStartedSessionController, closeProductionReportingController, closePackingReportingController } = require('../controller/reportController');

// Storage
router.post('/getAllReports', getAllReports);
router.post('/removeComponentAndReturnToStock', removeComponentAndReturnToStock);
router.post('/addComponentsToReport', addComponentsToReport);
router.get('/getReportComponents/:report_id', getReportComponents);

// Production

// Packing


// General
router.get('/displayReportComments/:report_id', getReportComments);
router.post('/transferWorkspace', transferWorkspace);







// router.post('/postProductionReporting', reportingProductionController);
// router.post('/postPackingReporting', reportingPackingController);
router.post('/startSession', startSession);
router.get('/isStartedSession', isStartedSessionController);
router.post('/CloseProductionReporting', closeProductionReportingController);
router.post('/closePackingReporting', closePackingReportingController);

module.exports = router;
