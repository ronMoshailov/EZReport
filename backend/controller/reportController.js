const Report = require('../model/Report');  // Import the User model
const mongoose = require('mongoose');

// Get all reports
const getReports = async (req, res) => {
  const { workspace, isQueue } = req.body;                                                              // Get data
  console.log(`Data received in 'getReports' is: [workspace: ${workspace}, isQueue: ${isQueue}]`);      // Log
  
  try {
    const reports = await Report.find({ current_workspace: workspace, enable: !isQueue });              // Get all reports from mongoDB
    res.status(200).json(reports);                                                                      // Receiving the reports was successful

  } catch (err) {
    res.status(500).json({ message: err.message });                                                     // Receiving the reports was failed
  }
};

// Update report's workspace after transmition
const updateReportWorkspace = async (req, res) => {

  // Get data
  const { report_id, newTransition_id } = req.body;

  // Log the recieved data
  console.log(`Starting update the report workspace. The received data is [report_id: ${report_id}, newTransition_id: ${newTransition_id}]`);

  // Map next workspace
  const nextWorkspacenMap = {
    Packing: 'Out of our system!',
    Production: 'Packing',
    Storage: 'Production',
  };

  try {
    // Retrieve the current workspace
    const report = await Report.findById(report_id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Determine the next workspace
    const current_workspace = report.current_workspace;
    const next_workspace = nextWorkspacenMap[current_workspace];

    if (!next_workspace) {
      return res.status(400).json({ message: `No mapping found for the current workspace: ${current_workspace}` });
    }

    // Update the report
    report.current_workspace = next_workspace; // Update workspace
    report.enable = !report.enable; // Toggle enable field
    report.transferDetails.push(newTransition_id); // Add transition ID to the array

    // Save the updated document
    await report.save();

    res.status(200).json({ message: 'Report updated successfully', report });
  } catch (error) {
    console.error('Error updating report:', error.message);
    res.status(500).json({ message: 'Error updating report', error: error.message });
  }
};

const addComment = async (req, res) => {
  const { report_id, comment } = req.body;  // Get workspace from the request body

  // console.log('The report_id is empty: ' + report_id);

  if (!report_id) {
    return res.status(400).json({ message: 'report_id are required.' });
  }

  try {
    // console.log('Trying to get all reports..');
    const response = await Report.findByIdAndUpdate( report_id, { $set: { lastComment: comment } });

    if (!response) {
      return res.status(404).json({ message: "Report not found." });
    }

    res.status(200).json({ message: "Comment updated successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addComponents = async (req, res) => {
  const { report_id, components_list } = req.body; // Extract `report_id` and `components_list` from the request body

  if (!report_id) {
    return res.status(400).json({ message: 'report_id is required.' });
  }

  if (!Array.isArray(components_list) || components_list.length === 0) {
    return res.status(400).json({ message: 'components_list must be a non-empty array.' });
  }

  try {
    // Find the report by ID
    const report = await Report.findById(report_id);

    if (!report) {
      return res.status(404).json({ message: "Report not found." });
    }

    // Create a map of existing components in the report for quick lookup
    const componentMap = new Map(report.components.map(comp => [comp.component.toString(), comp]));

    // Iterate through the incoming components_list
    components_list.forEach(newComponent => {
      const existingComponent = componentMap.get(newComponent.component);

      if (existingComponent) {
        // Update stock if component already exists
        existingComponent.stock += newComponent.stock;
      } else {
        // Add new component to the `components` array
        report.components.push(newComponent);
      }
    });

    // Save the updated report
    await report.save();

    res.status(200).json({ message: "Components updated successfully.", report });
  } catch (err) {
    res.status(500).json({ message: `Internal server error: ${err.message}` });
  }
};

const getLastTransferDetail = async (req, res) => {
  const { report_id } = req.params;

  try {
    // Log raw request
    console.log('Received GET request with params:', req.params);

    // Fetch report from the database
    const report = await Report.findOne(
      { _id: report_id },
      { transferDetails: { $slice: -1 } }
    );

    // Log the fetched report
    console.log('Fetched report:', report);

    if (!report || !report.transferDetails || report.transferDetails.length === 0) {
      console.log('No transfer details found for this report.');
      return res.status(404).json({ message: 'No transfer details found for this report.' });
    }

    const lastTransferDetail = report.transferDetails[0];
    console.log('Last transfer detail ID:', lastTransferDetail);

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(lastTransferDetail)) {
      console.log('Invalid ObjectId in transferDetails:', lastTransferDetail);
      return res.status(400).json({
        message: 'Invalid ObjectId in transferDetails.',
        lastTransferDetail
      });
    }

    res.status(200).json({
      message: 'Last transfer detail retrieved successfully.',
      lastTransferDetail
    });
  } catch (err) {
    console.error('Error fetching the last transfer detail:', err.message);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

const toggleEnable = async (req, res) => {
  const { report_id } = req.body;

  try {
    // Fetch the report
    const report = await Report.findById(report_id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Toggle the `enable` field
    report.enable = !report.enable;

    // Save the updated report
    const updatedReport = await report.save();

    res.status(200).json({
      message: 'Report enable field toggled successfully',
      updatedReport,
    });
  } catch (error) {
    console.error('Error toggling enable field:', error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const getReportComponents = async (req, res) => {
  const { report_id } = req.params;

  try {
    const report = await Report.findById(report_id)
      .populate('components.component', '_id name serialNumber') // Populate the component details
      .select('components');

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    const componentsList = report.components.map((comp) => ({
      _id: comp.component._id, // Include the _id
      name: comp.component.name,
      serialNumber: comp.component.serialNumber,
      stock: comp.stock,
    }));

    res.status(200).json({
      message: 'Components list retrieved successfully',
      components_list: componentsList,
    });
  } catch (error) {
    console.error('Error retrieving components:', error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const removeComponentFromReport = async (req, res) => {
  const { report_id, component_id } = req.body;
  try {
    const updatedReport = await Report.findByIdAndUpdate(
      report_id,
      { $pull: { components: { component: component_id } } }, // Remove component from array
      { new: true } // Return the updated report
    );

    if (!updatedReport) {
      return res.status(404).json({ message: 'Report not found.' });
    }

    res.status(200).json({ message: 'Component removed from report successfully.', updatedReport });
  } catch (error) {
    console.error('Error removing component from report:', error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};






















// Controllers that I didn't use
// const getTransmission = async (req, res) => {
//   try {
//     // Step 1: Retrieve the report by `_id`
//     const reportId = req.params.id;
//     const report = await Report.findById(reportId).populate('history'); // Populate history if it's a reference

//     // If no report is found, return a 404 response
//     if (!report) {
//       return res.status(404).json({ message: 'Report not found' });
//     }

//     // Step 2: Filter the history array to get entries with `isFinished` set to `false`
//     const unfinishedTransitions = report.history.filter(entry => !entry.isFinished);

//     // Step 3: Return only the unfinished transitions
//     res.status(200).json({
//       message: 'Unfinished transitions retrieved successfully',
//       unfinishedTransitions
//     });
//   } catch (error) {
//     console.error('Error fetching report:', error.message);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };


// const getReport = async (req, res) => {
//   try {
//     // Extract `_id` from request parameters
//     const reportId = req.params.id;

//     // Find the report by `_id` and populate `history` to include full documents
//     const report = await Report.findById(reportId);

//     // If no report is found, return a 404 response
//     if (!report) {
//       return res.status(404).json({ message: 'Report not found' });
//     }

//     // Return the report as a JSON response
//     res.status(200).json(report);
//   } catch (error) {
//     console.error('Error fetching report:', error.message);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };


// Export the controller functions
module.exports = { getReports , updateReportWorkspace, addComment, addComponents, getLastTransferDetail, toggleEnable, getReportComponents, removeComponentFromReport};
