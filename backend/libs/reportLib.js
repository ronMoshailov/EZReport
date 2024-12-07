const Report = require('../model/Report');
const Component = require('../model/Component');
const mongoose = require('mongoose');
const ReportingStorage = require('../model/ReportingStorage');
const { fetchComponentByID, increaseStockById } = require('../libs/componentLib');
const { createReportingStorage } = require('../libs/reportingStorageLib');
const { createTransferDocument, recieveUpdate, getTransferDocument } = require('../libs/transferDetailsLib');
const { findEmployeeById } = require("./employeeLib");
const { createProdReport } = require('./reportingProductionLib');
const { createPackingReporting } = require('./reportingPacking');

const fetchReportsByWorkspace = async (workspace, isQueue) => {
  try {
    // Fetch reports from the database
    const reports = await Report.find({
      current_workspace: workspace,
      inQueue: isQueue,
    });
    return reports;
  } catch (error) {
    console.error("Error in fetchReportsByWorkspace: failed to fetch reports");
    throw new Error('Failed to fetch reports');
  }
};

// Remove component from report and update stock
const removeComponentAndUpdateStock = async (reportId, componentId, stockToAdd) => {

  const session = await mongoose.startSession();
  session.startTransaction();

  try{
    await removeComponentFromReport(reportId, componentId, session);
    const updatedStock = await increaseStockById(componentId, stockToAdd, session);
    
    await session.commitTransaction();
    session.endSession();
    return updatedStock;

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error in removeComponentAndUpdateStock:", error.message);
    throw new Error("Removing component from report failed");
  }
};

const handleAddComponentsToReport = async ({ employee_id, report_id, components_list, comment }) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const date = new Date();
    date.setHours(date.getHours() + 2);
    
    // Add report to storage
    const newStorageReporting = await createReportingStorage(employee_id, date, components_list, comment, session)
    
    // Update the report with components
    const report = await Report.findById(report_id).session(session);
    if (!report){
      console.error("Error in handleAddComponentsToReport: Report not found");
      throw new Error('Report not found.');
    }

    report.reportingStorage_list.push(newStorageReporting);

    const componentMap = new Map(report.components.map((comp) => [comp.component.toString(), comp]));

    components_list.forEach((newComponent) => {
      const existingComponent = componentMap.get(newComponent.component);
      existingComponent ? existingComponent.stock += newComponent.stock : report.components.push(newComponent);
    });
    await report.save({ session });

    // Decrease stock
    for (const comp of components_list) {
      const component = await Component.findById(comp.component).session(session);
      if (!component){
        console.error("Error in handleAddComponentsToReport: ");
        throw new Error(`Component not found: ${comp.component}`);
      } 
      component.stock = Math.max(0, component.stock - comp.stock);
      await component.save({ session });
    }
    // Add newReportingStorage to the report
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

const fetchReportComponents = async (report_id) => {
  try {
    
    const report = await Report.findById(report_id, { components: 1 });

    if (!report) {
      console.error("Error in fetchReportComponents: Report not found");
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

const handleTransferWorksplace = async (employeeId, report, session) => {

  try{
    const date = new Date();
    date.setHours(date.getHours() + 2);

    if (!report.inQueue){
      const transferData = {
        send_worker_id: employeeId,
        send_workspace: report.current_workspace,
        send_date: date,
      };
      const newTransfer = await createTransferDocument(transferData, session);
      await updateReportWorkspace(report, newTransfer._id, session);
    }
    else{
      const lastTransferDocument_id = report.transferDetails[report.transferDetails.length - 1];
      const transferDocument = await getTransferDocument(lastTransferDocument_id);
      await recieveUpdate(transferDocument, report.current_workspace, employeeId, session);
      report.inQueue = !report.inQueue;
      await report.save({ session })

    }
  } catch(error) {
    console.error("Error in handleTransferWorksplace:", error.message);
    throw new Error(error.message);
  }
}

const startReportingProduction = async (report, completedCount, employeeId, newComment) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const newReportingProduction = await createProdReport(report._id, employeeId, completedCount, newComment, session);

    // Ensure `report_production_list` is initialized
    if (!Array.isArray(report.report_production_list)) {
      report.report_production_list = []; // Initialize as an empty array if undefined
    }

    if (report.producedCount + completedCount > report.orderedCount) throw new Error(`The Total amount is greater than the ordered amount.`);
      
    report.reportingProduction_list.push(newReportingProduction._id); // Add directly instead of `findByIdAndUpdate`
    report.producedCount += completedCount;

    await report.save({ session });

    await session.commitTransaction();
    session.endSession();
    return newReportingProduction;

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error in startReportingProduction:", error.message);
    throw error;
  }

}

const startReportingPacking = async (report, completedCount, employeeId, newComment) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const newReportingPacking = await createPackingReporting(report._id, employeeId, completedCount, newComment, session);

    // Ensure `report_production_list` is initialized
    if (!Array.isArray(report.reportingPacking_list)) {
      report.reportingPacking_list = []; // Initialize as an empty array if undefined
    }

    if (report.packedCount + completedCount > report.producedCount) throw new Error(`The Total amount is greater than the produced amount.`);
      
    report.reportingPacking_list.push(newReportingPacking._id); // Add directly instead of `findByIdAndUpdate`
    report.packedCount += completedCount;

    await report.save({ session });

    await session.commitTransaction();
    session.endSession();
    return newReportingPacking;

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error in startReportingProduction:", error.message);
    throw error;
  }

}

// For internal use only
const removeComponentFromReport = async (reportId, componentId, session) => {
  try{
  const updatedReport = await Report.findByIdAndUpdate(
    reportId,
    { $pull: { components: { component: componentId } } },
    { new: true, session } 
  );

  if (!updatedReport) throw new Error('Error in removeComponentFromReport: Report not found');
  
  return updatedReport;

  } catch (error){
    console.error("Error in removeComponentFromReport:", error.message);
    throw new Error("Removing component from report failed");
  }
}

const updateReportWorkspace = async (report, newTransitionId, session) => {

  const nextWorkspaceMap = {
    Packing: 'Out of our system!',
    Production: 'Packing',
    Storage: 'Production',
  };
  
  try{
    
    const nextWorkspace = nextWorkspaceMap[report.current_workspace];
    if (!nextWorkspace) {
      console.error("Error in updateReportWorkspace: No mapping found for the current workspace");
      throw new Error(`No mapping found for the current workspace: ${report.current_workspace}`);
    }
  
    report.current_workspace = nextWorkspace;
    report.inQueue = !report.inQueue;
    report.transferDetails.push(newTransitionId);
  
    await report.save({ session });
    return report;


  } catch (error){
    if(error.message === "Report not found" || error.message === `No mapping found for the current workspace: ${report.current_workspace}`)
      return error;
    console.error("Error in updateReportWorkspace:", error.message);
    throw error
  }

};



module.exports = { 
  removeComponentAndUpdateStock,
  handleAddComponentsToReport, 
  fetchReportsByWorkspace, 
  updateReportWorkspace, 
  fetchReportComponents, 
  handleTransferWorksplace, 
  startReportingProduction,
  startReportingPacking
 };
