const Report = require('../model/Report');  // Import the User model

  // Function to check if a user exists by ID
const getReports = async (req, res) => {
  const { position, isQueue } = req.body;  // Get position from the request body
  console.log('position recieved in router: ' + position);
  try {
    console.log('Trying to get all reports..');
    const reports = await Report.find({ current_station: position, enable: !isQueue });
    res.status(200).json(reports);
    console.log('All reports was sent back.');
} catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Export the controller functions
module.exports = { getReports };
