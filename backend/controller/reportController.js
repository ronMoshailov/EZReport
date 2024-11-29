const Report = require('../model/Report');  // Import the User model
const mongoose = require('mongoose');
const { removeComponentAndUpdateStock, handleAddComponentsToReport, fetchReportsByWorkspace, updateReportWorkspace, fetchReportComponents } = require('../libs/reportLib');
const { createTransferDocument } = require('../libs/transferDetailsLib');
const { fetchReportStorageList, fetchCommentsFromReportStorage } = require('../libs/reportStorageLib');

// In libs

/**
 * Get all reports by workspace and queue status.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const getAllReports = async (req, res) => {
  const { workspace, isQueue } = req.body;

  try {
    // Use the library function to fetch reports
    const reports = await fetchReportsByWorkspace(workspace, isQueue);
    res.status(200).json(reports); // Respond with the reports
  } catch (error) {
    console.error('Error in getAllReports:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// Storage
const removeComponentAndReturnToStock = async (req, res) => {
  const { report_id, component_id, stock } = req.body;                                                                                                      // Extract input data

  try {
    await removeComponentAndUpdateStock(report_id, component_id, stock);                                        // Call the lib function to perform the operation

    res.status(200).json({                                                                // 200
      message: 'Component removed from report and stock updated successfully.'            // 200
    });
  } catch (error) {                                                                       // Error
    console.error('Error removing component and updating stock:', error.message);         // Error
    res.status(500).json({ message: 'Internal server error', error: error.message });     // Error
  }
};

const addComponentsToReport = async (req, res) => {
  const { employee_id, report_id, components_list, comment } = req.body;

  try {

    const result = await handleAddComponentsToReport({ employee_id, report_id, components_list, comment });
    
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Controller to fetch a report's components.
 * Responds with the components list or an error message.
 */
const getReportComponents = async (req, res) => {
  const { report_id } = req.params;

  try {
    const componentsList = await fetchReportComponents(report_id); // Use the lib to fetch the components

    res.status(200).json({
      message: 'Components list retrieved successfully',
      components_list: componentsList,
    });
  } catch (error) {
    console.error('Error in getReportComponents:', error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

/**
 * Handles the process of creating a transfer document, updating a report's workspace,
 * and toggling the report's enable status within a single transaction.
 */
const processWorkspaceTransfer = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { send_worker_id, send_workspace, report_id } = req.body;

    if (!send_worker_id || !send_workspace || !report_id) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Step 1: Create the transfer document
    const transferData = {
      send_worker_id,
      send_workspace,
      send_date: new Date().toISOString(),
      isReceived: false,
    };
    const newTransfer = await createTransferDocument(transferData, session);
    
    // Step 2: Update the report with the new transition and workspace
    await updateReportWorkspace(report_id, newTransfer._id, session);

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      message: 'Workspace transfer processed successfully',
      newTransitionId: newTransfer._id,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error processing workspace transfer:', error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};








const getLastTransferDetail = async (req, res) => {
  const { report_id } = req.params;

  try {

    // Fetch report from the database
    const report = await Report.findOne(
      { _id: report_id },
      { transferDetails: { $slice: -1 } }
    );

    if (!report || !report.transferDetails || report.transferDetails.length === 0) {
      return res.status(404).json({ message: 'No transfer details found for this report.' });
    }

    const lastTransferDetail = report.transferDetails[0];

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

/**
 * Retrieves all comments from the `reportstorage` collection linked to a specific report.
 * @param {Object} req - The request object containing the `report_id` in params.
 * @param {Object} res - The response object to send the data or errors.
 */
const getReportComments = async (req, res) => {
  const { report_id } = req.params;

  try {
    // Step 1: Fetch the report's storage list IDs
    const reportingStorage_list = await fetchReportStorageList(report_id);
    // Step 2: Fetch the comments from the reportstorage collection
    const comments = await fetchCommentsFromReportStorage(reportingStorage_list);
    // Step 3: Send the comments in the response
    res.status(200).json(comments);
  } catch (error) {
    console.error('Error in getReportComments:', error.message);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

// Export the controller functions
module.exports = { getAllReports, getLastTransferDetail, getReportComponents, removeComponentAndReturnToStock, addComponentsToReport, processWorkspaceTransfer, getReportComments };
