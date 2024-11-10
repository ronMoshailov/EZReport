const express = require('express');
const router = express.Router();
const {getComponent, getComponentByID, decreaseStock, addBackToStock} = require('../controller/componentController'); // Assuming this is your component model

// Get all components
router.get('/components', getComponent);
router.get('/getComponentByID/:id', getComponentByID);
router.post('/decreaseStock', decreaseStock);
router.post('/addBackToStock', addBackToStock);

module.exports = router;
