const express = require('express');
const router = express.Router();

const { 
    getAllReportsController, 
    getAllReportsByWorkspaceController, 
    addComponentsToReport, 
    getReportComponentsController, 
    removeComponentAndReturnToStockController, 
    transferWorkspace, 
    getReportComments, 
    startSession, 
    closeProductionReportingController, 
    closePackingReportingController, 
    calcAverageTimePerProductController 
} = require('../controller/reportController');

// Storage
router.post('/removeComponentAndReturnToStock', removeComponentAndReturnToStockController);
router.post('/addComponentsToReport', addComponentsToReport);
router.get('/getReportComponents/:report_id', getReportComponentsController);

// General
router.get('/displayReportComments/:report_id', getReportComments);
router.post('/transferWorkspace', transferWorkspace);
router.post('/getAllReportsByWorkspace', getAllReportsByWorkspaceController);
router.get('/getAllReports', getAllReportsController);

// Manager
router.post('/calcAverageTimePerProductController/:serialNum', calcAverageTimePerProductController);

router.post('/startSession', startSession);
router.post('/CloseProductionReporting', closeProductionReportingController);
router.post('/closePackingReporting', closePackingReportingController);

module.exports = router;
