const Report = require('../model/Report');
const Component = require('../model/Component');
const mongoose = require('mongoose');
const ReportStorage = require('../model/ReportStorage');

/**
 * Fetch all reports by workspace and queue status.
 * @param {string} workspace - The workspace identifier.
 * @param {boolean} isQueue - Whether to fetch reports in the queue or not.
 * @returns {Promise<Array>} - A promise that resolves to the list of reports.
 * @throws {Error} - Throws an error if the query fails.
 */
const fetchReportsByWorkspace = async (workspace, isQueue) => {
  try {
    // Fetch reports from the database
    const reports = await Report.find({
      current_workspace: workspace,
      enable: !isQueue,
    });
    return reports;
  } catch (error) {
    console.error('Error fetching reports:', error.message);
    throw new Error('Failed to fetch reports.');
  }
};

// Storage

// Remove component from report and update stock
const removeComponentAndUpdateStock = async (reportId, componentId, stockToAdd) => {
  console.log('componentId');
  console.log(componentId);
  const session = await mongoose.startSession(); // Start a transaction
  session.startTransaction();

  try {
    // Step 1: Remove component from the report
    const updatedReport = await Report.findByIdAndUpdate(
      reportId,
      { $pull: { components: { component: componentId } } }, // Remove the component from report
      { new: true, session } // Use the session to ensure atomicity
    );

    if (!updatedReport) {
      throw new Error('Report not found.');
    }
    console.log('The report updated (removed the component)');

    // Step 2: Update stock of the component
    const updatedComponent = await Component.findByIdAndUpdate(
      componentId,
      { $inc: { stock: stockToAdd } }, // Increment stock
      { new: true, session }
    );

    if (!updatedComponent) {
      throw new Error('Component not found.');
    }
    console.log('The component stock was updated');
    
    // Commit the transaction if both operations succeed
    await session.commitTransaction();
    session.endSession();

    // return { updatedReport, updatedComponent };
  } catch (error) {
    // Abort the transaction on error
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// Add components to report
const handleAddComponentsToReport = async ({ employee_id, report_id, components_list, comment }) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const date = new Date();

    // Step 1: Add report to storage
    const newReportStorage = new ReportStorage({
      employee_id,
      date,
      components_list,
      comment,
    });
    await newReportStorage.save({ session });

    // Step 2: Update the report with components
    const report = await Report.findById(report_id).session(session);
    if (!report) throw new Error('Report not found.');

    const componentMap = new Map(report.components.map((comp) => [comp.component.toString(), comp]));

    components_list.forEach((newComponent) => {
      const existingComponent = componentMap.get(newComponent.component);
      if (existingComponent) {
        existingComponent.stock += newComponent.stock;
      } else {
        report.components.push(newComponent);
      }
    });

    await report.save({ session });

    // Step 3: Decrease stock
    for (const comp of components_list) {
      const component = await Component.findById(comp.component).session(session);
      if (!component) throw new Error(`Component not found: ${comp.component}`);
      component.stock = Math.max(0, component.stock - comp.stock);
      await component.save({ session });
    }

    // Step 4: Add comment to the report
    report.lastComment = comment;
    report.report_storage_list.push(newReportStorage._id); // Add directly instead of `findByIdAndUpdate`
    await report.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return { success: true, message: 'Report and components processed successfully.' };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Transaction failed:', error.message);
    throw new Error(`Transaction failed: ${error.message}`);
  }
};

// Support
/**
 * Updates the workspace and transition details of a report.
 * @param {String} reportId - The ID of the report to update.
 * @param {String} newTransitionId - The ID of the transition to add.
 * @param {Object} session - The MongoDB session for transactions.
 * @returns {Object} - The updated report.
 * @throws {Error} - Throws an error if the update fails.
 */
const updateReportWorkspace = async (reportId, newTransitionId, session) => {
  console.log(`updateReportWorkspace -> [reportId: ${reportId}, newTransitionId: ${newTransitionId}]`);
  const nextWorkspaceMap = {
    Packing: 'Out of our system!',
    Production: 'Packing',
    Storage: 'Production',
  };

  const report = await Report.findById(reportId).session(session);

  if (!report) {
    throw new Error('Report not found');
  }

  const nextWorkspace = nextWorkspaceMap[report.current_workspace];
  if (!nextWorkspace) {
    throw new Error(`No mapping found for the current workspace: ${report.current_workspace}`);
  }

  report.current_workspace = nextWorkspace;
  report.enable = !report.enable;
  report.transferDetails.push(newTransitionId);

  await report.save({ session });
  return report;
};

/**
 * Toggles the `enable` field of a report.
 * @param {String} reportId - The ID of the report to toggle.
 * @param {Object} session - The MongoDB session for transactions.
 * @returns {Object} - The updated report.
 * @throws {Error} - Throws an error if the toggle fails.
 */
const toggleEnable = async (reportId, session) => {
  const report = await Report.findById(reportId).session(session);

  if (!report) {
    throw new Error('Report not found');
  }
  console.log("Change 'enable'.")
  report.enable = !report.enable;
  
  console.log("saving.")
  await report.save({ session });
};
































module.exports = { removeComponentAndUpdateStock , handleAddComponentsToReport, fetchReportsByWorkspace, updateReportWorkspace, updateReportWorkspace, toggleEnable };
