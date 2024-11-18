const express = require('express');
const router = express.Router();
const {getAllComponent, getComponentByID} = require('../controller/componentController');

router.get('/getAllComponent', getAllComponent);
router.get('/getComponentByID/:id', getComponentByID);

module.exports = router;
