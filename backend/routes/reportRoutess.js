const express = require('express');
const router = express.Router();
const { getAllReports, getAllReportsByWorkspace, addComponentsToReport, getReportComponents, removeComponentAndReturnToStock, transferWorkspace, getReportComments, reportingProductionController, reportingPackingController, startSession, isStartedSessionController, closeProductionReportingController, closePackingReportingController, calcAverageTimePerProductController } = require('../controller/reportController');

// Storage
router.post('/removeComponentAndReturnToStock', removeComponentAndReturnToStock);
router.post('/addComponentsToReport', addComponentsToReport);
router.get('/getReportComponents/:report_id', getReportComponents);

// Production

// Packing


// General
router.get('/displayReportComments/:report_id', getReportComments);
router.post('/transferWorkspace', transferWorkspace);
router.post('/getAllReportsByWorkspace', getAllReportsByWorkspace);
router.get('/getAllReports', getAllReports);

// Manager
router.post('/calcAverageTimePerProductController/:serialNum', calcAverageTimePerProductController);




// router.post('/postProductionReporting', reportingProductionController);
// router.post('/postPackingReporting', reportingPackingController);
router.post('/startSession', startSession);
router.get('/isStartedSession', isStartedSessionController);
router.post('/CloseProductionReporting', closeProductionReportingController);
router.post('/closePackingReporting', closePackingReportingController);

module.exports = router;
