const express = require('express');
const router = express.Router();
const { getAllReports, addComponentsToReport, getLastTransferDetail, getReportComponents, removeComponentAndReturnToStock, processWorkspaceTransfer, getReportComments } = require('../controller/reportController');

router.post('/getAllReports', getAllReports);
router.post('/removeComponentAndReturnToStock', removeComponentAndReturnToStock);
router.post('/addComponentsToReport', addComponentsToReport);
router.get('/getReportComponents/:report_id', getReportComponents);
router.get('/displayReportComments/:report_id', getReportComments);


router.get('/getLastTransferDetail/:report_id', getLastTransferDetail);
router.post('/processWorkspaceTransfer', processWorkspaceTransfer);

module.exports = router;
