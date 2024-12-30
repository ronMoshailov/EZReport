const Report = require('../model/Report');
const Component = require('../model/Component');
const mongoose = require('mongoose');
const ReportingStorage = require('../model/ReportingStorage');
const ReportingProduction = require('../model/ReportingProduction');
const ReportingPacking = require('../model/ReportingPacking');

const { fetchComponentByID, increaseStockById } = require('../libs/componentLib');
const { createTransferDocument, recieveUpdate, getTransferDocument } = require('../libs/transferDetailsLib');

// Fetch all the reports by workspace (called by controller)
const fetchReportsByWorkspace = async (workspace, isQueue) => {
  
  try {
    // Fetch reports from the database
    const reports = await Report.find({ 
      current_workspace: workspace, 
      status: isQueue ? 'PENDING' : { $in: ['OPEN', 'IN_WORK'] } 
    });
    return reports;
    
  } catch (error) {
    console.error("Error in fetchReportsByWorkspace: failed to fetch reports");
    throw new Error('Failed to fetch reports');
  }
};

// Fetch all components of a report (Used for storage) (called by controller)
const fetchReportComponents = async (report) => {
  
  try {  
    // Get data
    component_array = report.components;
    const fullComponentData = [];

    // For each component if the array find his full data and isert to new array
    for (const item of component_array) {
      const componentData = await fetchComponentByID(item.component);
    
      if (componentData) {
        fullComponentData.push({
          stock: item.stock, 
          name: componentData.name, 
          serialNumber: componentData.serialNumber,
          _id: componentData._id
        });
      }
    }

    return fullComponentData;

  } catch (error) {
    console.error(`Error fetchReportComponents: ${error.message}`);
    throw error;
  }
};

const removeComponentAndUpdateStock = async (report, componentId, stockToAdd) => {

  const session = await mongoose.startSession();
  session.startTransaction();

  try{
    // Check if the component exists in the report
    const initialComponentsLength = report.components.length;

    // Filter out the component to remove it
    report.components = report.components.filter(
      (comp) => comp.component.toString() !== componentId
    );

    // Check if a component was removed
    if (report.components.length === initialComponentsLength) {
      throw new Error("Component does not exist in the report");
    }

    // Save the updated report
    await report.save({ session });
    
    // Update the stock for the component
    const updatedComponent = await increaseStockById(componentId, stockToAdd, session);
    
     // Commit the transaction
    await session.commitTransaction();
    session.endSession();
    return updatedComponent.stock;

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error in removeComponentAndUpdateStock:", error.message);
    throw new Error("Removing component from report failed");
  }
};

// Fetch all components of a report (Used for storage) (called by controller)
const handleAddComponentsToReport = async ({ report, reporting, components_list, comment }) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const date = new Date();
    date.setHours(date.getHours() + 2);

    // Update the reporting
    reporting.end_date = date;
    reporting.components_list = components_list;
    if (comment != '')
      reporting.comment = comment;

    // Save the reporting
    await reporting.save({session});

    // Add the components to the report
    const componentMap = new Map(report.components.map((comp) => [comp.component.toString(), comp]));

    components_list.forEach((newComponent) => {
      const existingComponent = componentMap.get(newComponent.component);
      existingComponent ? existingComponent.stock += newComponent.stock : report.components.push(newComponent);
    });
    
    // Decrease stock
    for (const comp of components_list) {
      const component = await Component.findById(comp.component).session(session);
      if (!component){
        await session.abortTransaction();
        session.endSession();
        console.error("Error in handleAddComponentsToReport: ");
        return {success: false, message: 'Component not found in DB'};
      } 
      component.stock = component.stock - comp.stock;
      if(component.stock < 0){
        await session.abortTransaction();
        session.endSession();
        console.error("Error in handleAddComponentsToReport: ");
        return {success: false, message: 'After the update the stock is negative'};
      }

      // Update the component
      await component.save({ session });
    }

    // Change the status if needed
    const isWorking = await isReportBeingWorkedOn(report.current_workspace, session);
    if(!isWorking)
      report.status = 'OPEN';
    
    // Save the report
    await report.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return { success: true, message: 'Report and components processed successfully.' };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error in handleAddComponentsToReport: Transaction failed:', error.message);
    throw new Error(`Transaction failed: ${error.message}`);
  }
};

// Handle transfer report (called by controller)
const handleTransferWorksplace = async (employeeId, report, session) => {

  try{
    // Initialize date
    const date = new Date();
    date.setHours(date.getHours() + 2);

    // If the report is not in queue so add the data about sending 
    if (report.status !== 'FINISHED' && report.status !== 'PENDING'){
      if (report.current_workspace === 'Packing'){
        report.status = 'FINISHED';
        report.current_workspace = 'Finished';
        await report.save({session});
        return;
      }
      const transferData = {
        send_worker_id: employeeId,
        send_workspace: report.current_workspace,
        send_date: date,
        received_worker_id: null,
        received_date: null,
        received_workspace: null,
      };
      // Create new transfer document
      const newTransfer = await createTransferDocument(transferData, session);

      // Update the report
      await updateReportWorkspace(report, newTransfer._id, session);
    }
    // Else, the client try to receive
    else if (report.status === 'PENDING'){
      // Get the last document of transfer id (can be just 1 for each transfer, will be 3 after a full process from storage to packing)
      const lastTransferDocument_id = report.transferDetails[report.transferDetails.length - 1];

      // get the full transfer document
      const transferDocument = await getTransferDocument(lastTransferDocument_id);

      // Update the transfer document
      await recieveUpdate(transferDocument, report.current_workspace, employeeId, session);

      // toggle the inQueue
      // report.inQueue = !report.inQueue;

      // Update status
      report.status = 'OPEN';

      // Save the report
      await report.save({ session })

    }
    else{
      throw new Error('Invalid status');
    }
  } catch(error) {
    console.error("Error in handleTransferWorksplace:", error.message);
    throw new Error(error.message);
  }
}

// Handle close production reporting (called by controller)
const handleCloseProductionReporting = async (employee_id, report, completed, comment) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Initialize date
    const date = new Date();
    date.setHours(date.getHours() + 2);

    // Get employee reporting
    const response = await getEmployeeReporting(report.current_workspace, report.reportingProduction_list, employee_id);
    if(!response){
      console.error("Error in handleCloseProductionReporting: User not started a session");
      throw new Error('User not started a session.');
    }
    const productionReporting = response.reporting;
    
    // Update the reporting
    productionReporting.end_date = date;
    productionReporting.completedCount = completed;
    if (comment != '')
      productionReporting.comment = comment;

    // Save the reporting
    await productionReporting.save({session});

    // Change the status if needed
    const isWorking = await isReportBeingWorkedOn(report.current_workspace, session);
    if(!isWorking)
      report.status = 'OPEN';

    // Update the report
    report.producedCount += completed;
    await report.save({session});

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    // Return
    return { success: true, message: 'Reporting updated successfully.' };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error in: handleCloseProductionReporting:', error.message);
    throw error;
  }
};

// Handle close packing reporting (called by controller)
const handleClosePackingReporting = async (employee_id, report, completed, comment) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    // Initialize date
    const date = new Date();
    date.setHours(date.getHours() + 2);

    // Get employee reporting
    const response = await getEmployeeReporting(report.current_workspace, report.reportingPacking_list, employee_id);
    if(!response){
      console.error("Error in handleClosePackingReporting: User not started a session");
      throw new Error('User not started a session');
    }
    const packingReporting = response.reporting;

    // Update the reporting
    packingReporting.end_date = date;
    packingReporting.completedCount = completed;
    if (comment != '')
      packingReporting.comment = comment;

    // Save the reporting
    await packingReporting.save({session});

    // Change the status if needed
    const isWorking = await isReportBeingWorkedOn(report.current_workspace, session);
    if(!isWorking)
      report.status = 'OPEN';

    // Update the report
    report.packedCount += completed;
    await report.save({session});

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return { success: true, message: 'Reporting updated successfully.' };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error in: handleClosePackingReporting:', error.message);
    throw new Error(error.message);
  }
};

// Get employee reporting (called by controller)
const getEmployeeReporting = async(workspace, reportingList, employeeId) => {
  try {
    switch(workspace){
      case 'Storage':
        for(const documentId of reportingList.slice().reverse()){                                                                     // For each document_id
          const storageReporting = await ReportingStorage.findById(documentId);                                                       // Find the reporting that holds the document_id
          if(storageReporting.employee_id.toString() === employeeId.toString() && storageReporting.end_date === null)                 // Check if the reporting belong to the employee && the reporting didn't end
            return({message: "Reporting was found", reporting: storageReporting});                                                      // return the reporting
        }   
        return null;                                                                                                                  // If didn't found any reporting return null
  
        case 'Production':
          for(const documentId of reportingList.slice().reverse()){
            const productionReporting = await ReportingProduction.findById(documentId);
            if(productionReporting.employee_id.toString() === employeeId.toString() && productionReporting.end_date === null)
              return({message: "Reporting was found", reporting: productionReporting});
          }   
          return null;
        
        case 'Packing':
          for(const documentId of reportingList.slice().reverse()){
            const packingReporting = await ReportingPacking.findById(documentId);
            if(packingReporting.employee_id.toString() === employeeId.toString() && packingReporting.end_date === null)
            return({message: "Reporting was found", reporting: packingReporting});
        }   
          return null;
    }
  } catch (error) {
    console.error('Error in getEmployeeReporting:', error.message);
    throw error;
  }
}

// Calculate the average time per produced product
const calcAverageTime = async (productionList) => {

  // Initialize variables
  let count = 0;
  let hours = 0;
  let minutes = 0;

  // sum the count, hours, minutes
  for (const documentId of productionList){
    const document = await ReportingProduction.findById(documentId);
    if(!document.end_date)
      continue;
    const timePassed = document.end_date - document.start_date;

    count += document.completedCount;
    hours += Math.floor(timePassed / (1000 * 60 * 60));
    minutes += Math.floor((timePassed % (1000 * 60 * 60)) / (1000 * 60));
  }

  // Normalize the time
  hours += Math.floor(minutes / 60);
  minutes = minutes % 60;

  // Log & Return
  console.log(`Passed ${hours} hours and ${minutes} minutes.}`);
  return count/ (hours*60 + minutes);
}

// Update the report (For internal use only)
const updateReportWorkspace = async (report, newTransitionId, session) => {

  const nextWorkspaceMap = {
    Packing: 'Finished',
    Production: 'Packing',
    Storage: 'Production',
  };
  
  try{    
    const nextWorkspace = nextWorkspaceMap[report.current_workspace];
    if (!nextWorkspace) {
      console.error("Error in updateReportWorkspace: No mapping found for the current workspace");
      throw new Error(`No mapping found for the current workspace: ${report.current_workspace}`);
    }
  
    // Update report
    report.current_workspace = nextWorkspace;
    // report.inQueue = !report.inQueue;
    report.transferDetails.push(newTransitionId);
    report.status = 'PENDING';

    await report.save({ session });
    return report;

  } catch (error){
    if(error.message === "Report not found" || error.message === `No mapping found for the current workspace: ${report.current_workspace}`)
      return error;
    console.error("Error in updateReportWorkspace:", error.message);
    throw error
  }
};

// 
const isReportBeingWorkedOn = async (workspace, session) => {

  let isWorking;

  switch(workspace){

    case 'Storage':
      isWorking = await ReportingStorage.findOne({ end_date: null }).session(session);
      if(isWorking)
        return true;
      return false;

    case 'Production':
      isWorking = await ReportingProduction.findOne({ end_date: null }).session(session);
      if(isWorking)
        return true;
      return false;

    case 'Packing':
      isWorking = await ReportingPacking.findOne({ end_date: null }).session(session);
      if(isWorking)
        return true;
      return false;

  }

}

module.exports = { 
  removeComponentAndUpdateStock,
  handleAddComponentsToReport,
  fetchReportsByWorkspace,
  updateReportWorkspace,
  fetchReportComponents,
  handleTransferWorksplace,
  getEmployeeReporting,
  handleCloseProductionReporting,
  handleClosePackingReporting,
  calcAverageTime,
 };
