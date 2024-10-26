
const express = require('express');
const router = express.Router();
const { nextStation, isNumberPositionExist } = require('../controller/positionController');

router.get('/check-employee-number/:id', isNumberPositionExist);
router.post('/sendStation', nextStation);

module.exports = router;
