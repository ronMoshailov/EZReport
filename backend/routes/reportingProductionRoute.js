const express = require('express');
const router = express.Router();
const { createProductionReport } = require('../controller/reportingProductionController');

router.post('/createProductionReport', createProductionReport);

module.exports = router;