const Report = require('../model/Report');  // Import the User model
const mongoose = require('mongoose');
const { removeComponentAndUpdateStock, handleAddComponentsToReport, fetchReportsByWorkspace, updateReportWorkspace, fetchReportComponents } = require('../libs/reportLib');
const { createTransferDocument } = require('../libs/transferDetailsLib');
const { fetchReportStorageList, fetchCommentsFromReportStorage } = require('../libs/reportingStorageLib');
const { fetchCommentsFromReportProduction, fetchReportProductionList } = require('../libs/reportingProductionLib');

const getAllReports = async (req, res) => {
  const { workspace, isQueue } = req.body;
  try {
    const reports = await fetchReportsByWorkspace(workspace, isQueue);
    if(reports.length === 0){
      console.warn("Error in getAllReports: no reports was found");
      return res.status(404).json({message: "Reports not found"})
    }
    return res.status(200).json(reports);
  } catch (error) {
    console.error('Error in getAllReports:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// Storage
const removeComponentAndReturnToStock = async (req, res) => {
  try {
    // Check data
    const { report_id, component_id, stock } = req.body;
    if(stock <= 0 || report_id === undefined || component_id === undefined || stock === undefined){
      if(stock <= 0) console.error("Error in removeComponentAndReturnToStock: Stock is less or equal to zero");
      if(report_id === undefined) console.error("Error in removeComponentAndReturnToStock: report_id is undefined");
      if(component_id === undefined) console.error("Error in removeComponentAndReturnToStock: component_id is undefined");
      if(stock === undefined) console.error("Error in removeComponentAndReturnToStock: stock is undefined");
      return res.statue(400).json({message: "Invalid parameters"});
    }
    const updatedStock = await removeComponentAndUpdateStock(report_id, component_id, stock);
    return res.status(200).json({message: "Component removed successfully", stock: updatedStock});
  } catch (error) {                                                                       // Error
    console.error('Error in removeComponentAndReturnToStock:', error.message);         // Error
    res.status(500).json({ message: 'Internal server error', error: error.message });     // Error
  }
};

const addComponentsToReport = async (req, res) => {
  try {
    const { employee_id, report_id, components_list, comment } = req.body;
    if(components_list.length <= 0 || employee_id === undefined || report_id === undefined || components_list === undefined || comment === undefined){
      if(components_list.length <= 0) console.error("Error in addComponentsToReport: components_list is less or equal to zero");
      if(employee_id === undefined) console.error("Error in addComponentsToReport: employee_id is undefined");
      if(report_id === undefined) console.error("Error in addComponentsToReport: report_id is undefined");
      if(components_list === undefined) console.error("Error in addComponentsToReport: components_list is undefined");
      if(comment === undefined) console.error("Error in addComponentsToReport: comment is undefined");
      return res.statue(400).json({message: "Invalid parameters"});
    }
    const result = await handleAddComponentsToReport({ employee_id, report_id, components_list, comment });
    
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getReportComponents = async (req, res) => {
  const { report_id } = req.params;

  try {
    const componentsList = await fetchReportComponents(report_id);
    return res.status(200).json({message: 'Components list retrieved successfully', components_list: componentsList});
  } catch (error) {
    console.error("Error in getReportComponents:", error.message);
    if (error.message === "Report not found")
      return res.status(404).json({message: error.message});
    return res.status(500).json({ message: 'Internal server error', message: error.message });
  }
};

const getReportComments = async (req, res) => {
  const { report_id } = req.params;
  try {
    const report = await Report.findById(report_id, { current_workspace: 1 }); // Project only `current_workspace`
    if(!report) throw new Error("Report not found")

    let comments = null;
    let workspace = report.current_workspace;

    if (workspace === 'Production'){
      const reportingStorage_list = await fetchReportStorageList(report_id);
      comments = await fetchCommentsFromReportStorage(reportingStorage_list);
    } else if (workspace === 'Packing'){
      const reportingProduction_list = await fetchReportProductionList(report_id);
      comments = await fetchCommentsFromReportProduction(reportingProduction_list);
    } else{
      console.log('Error checking for comments');
      return;
    }
    return res.status(200).json({message: "The comments sent successfully", comments: comments});
  } catch (error) {
    if(error.message === "Report not found"){
      console.error("Error in getReportComments: Report not found");
      return res.status(404).json({message: "Report not found"});
    } else if(error.message === "Report not found"){
      console.error("Error in getReportComments: Comments not found");
      return res.status(404).json({message: "Comments not found"});
    }
    console.error('Error in getReportComments:', error.message);
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

















const processWorkspaceTransfer = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { send_worker_id, send_workspace, report_id } = req.body;

    if (send_worker_id === undefined || send_workspace === undefined || report_id === undefined) {
      if(send_worker_id === undefined) throw new Error("Error in processWorkspaceTransfer: sendWorkerID is undefined");
      if(send_workspace === undefined) throw new Error("Error in processWorkspaceTransfer: sendWorkspace is undefined");
      if(report_id === undefined) throw new Error("Error in processWorkspaceTransfer: reportId is undefined");
      return res.status(400).json({ message: 'Invalid parameters' });
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


// Export the controller functions
module.exports = { getAllReports, getLastTransferDetail, getReportComponents, removeComponentAndReturnToStock, addComponentsToReport, processWorkspaceTransfer, getReportComments };
