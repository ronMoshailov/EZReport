const Report = require('../model/Report');
const Component = require('../model/Component');
const mongoose = require('mongoose');
const ReportingStorage = require('../model/ReportingStorage');
const { fetchComponentByID } = require('../libs/componentLib');

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
      inQueue: isQueue,
    });
    return reports;
  } catch (error) {
    throw new Error('Failed to fetch reports.');
  }
};

// Remove component from report and update stock
const removeComponentAndUpdateStock = async (reportId, componentId, stockToAdd) => {

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const updatedReport = await Report.findByIdAndUpdate(
      reportId,
      { $pull: { components: { component: componentId } } },
      { new: true, session } 
    );

    if (!updatedReport) throw new Error('Report not found.');

    


    await session.commitTransaction();
    session.endSession();

  } catch (error) {
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
    const newReportingStorage = new ReportingStorage({
      employee_id,
      date,
      components_list,
      comment,
    });
    await newReportingStorage.save({ session });
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
    report.reportingStorage_list.push(newReportingStorage._id); // Add directly instead of `findByIdAndUpdate`
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
  report.inQueue = !report.inQueue;
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

/**
 * Fetches the `components` array from a report by its `_id`, replacing `component` IDs with full component data.
 * @param {string} report_id - The `_id` of the report.
 * @returns {Promise<Array>} - The components array with resolved component details.
 * @throws {Error} - Throws an error if the report is not found or any database issue occurs.
 */
const fetchReportComponents = async (report_id) => {
  try {
    // Fetch the report document by ID and project only the `components` field
    const report = await Report.findById(report_id, { components: 1 });

    if (!report) {
      throw new Error("Report not found");
    }

    component_array = report.components;

    // Map over the `components` array and replace the `component` ID with the full component data
    const componentsWithDetails = await Promise.all(
      component_array.map(async (item) => {
        const componentData = await fetchComponentByID(item.component); // Fetch component details
        // Return only the relevant fields for the component
        return {
          stock: item.stock, // Keep the stock property
          name: componentData.name, // Include only the name of the component
          serialNumber: componentData.serialNumber, // Include only the serial number
          _id: componentData._id
        };
      })
    );

    return componentsWithDetails; // Return the updated components array
  } catch (err) {
    console.error(`Error fetching report components: ${err.message}`);
    throw err; // Rethrow the error for the caller to handle
  }
};

module.exports = { removeComponentAndUpdateStock , handleAddComponentsToReport, fetchReportsByWorkspace, updateReportWorkspace, updateReportWorkspace, fetchReportComponents };
