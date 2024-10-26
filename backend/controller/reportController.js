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

const updateReportStation = async (req, res) => {
  const { _id, current_station, enable } = req.body;

  try {
    const updatedReport = await Report.updateOne(
      { _id },  // Use the ID from the request
      { 
        $set: { 
          current_station,  // Update current_station from request data
          enable: enable     // Set enable to false
        }
      }
    );

    res.status(200).json({ message: "Report updated successfully", updatedReport });
  } catch (error) {
    res.status(500).json({ message: "Error updating report", error: error.message });
  }
};

const addTransition = async (req, res) => {
  const { _id, current_station } = req.body;

  try {
    const updatedReport = await Report.updateOne(
      { _id },  // Use the ID from the request
      { 
        $set: { 
          current_station,  // Update current_station from request data
          enable: false     // Set enable to false
        }
      }
    );

    res.status(200).json({ message: "Report updated successfully", updatedReport });
  } catch (error) {
    res.status(500).json({ message: "Error updating report", error: error.message });
  }
};

const getReport = async (req, res) => {
  try {
    // Extract `_id` from request parameters
    const reportId = req.params.id;

    // Find the report by `_id` and populate `history` to include full documents
    const report = await Report.findById(reportId);

    // If no report is found, return a 404 response
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Return the report as a JSON response
    res.status(200).json(report);
  } catch (error) {
    console.error('Error fetching report:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getTransmission = async (req, res) => {
  try {
    // Step 1: Retrieve the report by `_id`
    const reportId = req.params.id;
    const report = await Report.findById(reportId).populate('history'); // Populate history if it's a reference

    // If no report is found, return a 404 response
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Step 2: Filter the history array to get entries with `isFinished` set to `false`
    const unfinishedTransitions = report.history.filter(entry => !entry.isFinished);

    // Step 3: Return only the unfinished transitions
    res.status(200).json({
      message: 'Unfinished transitions retrieved successfully',
      unfinishedTransitions
    });
  } catch (error) {
    console.error('Error fetching report:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Export the controller functions
module.exports = { getReports , updateReportStation , getReport , getTransmission};
