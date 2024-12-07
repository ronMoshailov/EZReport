const express = require('express');
const router = express.Router();
const { getAllReports, addComponentsToReport, getReportComponents, removeComponentAndReturnToStock, transferWorkspace, getReportComments, reportingProductionController, reportingPackingController } = require('../controller/reportController');

router.post('/getAllReports', getAllReports);
router.post('/removeComponentAndReturnToStock', removeComponentAndReturnToStock);
router.post('/addComponentsToReport', addComponentsToReport);
router.get('/getReportComponents/:report_id', getReportComponents);
router.get('/displayReportComments/:report_id', getReportComments);
router.post('/transferWorkspace', transferWorkspace);
router.post('/postProductionReporting', reportingProductionController);
router.post('/postPackingReporting', reportingPackingController);

module.exports = router;
