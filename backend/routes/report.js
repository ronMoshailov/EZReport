
const express = require('express');
const router = express.Router();
const Report = require('../model/report'); // Your Report model

// GET all reports
router.get('/reports', async (req, res) => {
  try {
    console.log('Trying to get data for cards.');
    const reports = await Report.find(); // Fetch all reports from MongoDB
    res.json(reports); // Send the reports as a JSON response
    console.log('Data was sent back.');
} catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
