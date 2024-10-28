
const express = require('express');
const router = express.Router();
const { sendStation, isPositionExist , receiveStation} = require('../controller/positionController');

router.get('/isPositionExist/:id', isPositionExist);
router.post('/sendStation', sendStation);
router.post('/receiveStation', receiveStation);

module.exports = router;
