
const express = require('express');
const router = express.Router();
const { sendStation, isNumberPositionExist , receiveStation} = require('../controller/positionController');

router.get('/isPositionExist/:id', isNumberPositionExist);
router.post('/sendStation', sendStation);
router.post('/receiveStation', receiveStation);

module.exports = router;
