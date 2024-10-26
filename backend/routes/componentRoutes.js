const express = require('express');
const router = express.Router();
const {getComponent, getComponentByID} = require('../model/Component'); // Assuming this is your component model

// Get all components
router.get('/components', getComponent);

// Check if a component exists by ID
router.get('/components/:id', getComponentByID);

module.exports = router;
