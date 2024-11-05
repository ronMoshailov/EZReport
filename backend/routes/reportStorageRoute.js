const express = require('express');
const router = express.Router();
const { addReportStorage } = require('../controller/reportStorageController');

// Route to add a new reportStorage
router.post('/addReportStorage', addReportStorage);

module.exports = router;
