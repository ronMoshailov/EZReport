// Import
const Report = require('../model/Report');
const mongoose = require('mongoose');

// Import libs
const { removeComponentAndUpdateStock, handleAddComponentsToReport, fetchReportsByWorkspace, fetchReportComponents, handleTransferWorksplace, getEmployeeReporting, handleCloseProductionReporting, handleClosePackingReporting, calcAverageTime } = require('../libs/reportLib');
const { fetchStorageComments, initializeReportingStorage } = require('../libs/reportingStorageLib');
const { initializeReportingPacking } = require('../libs/reportingPacking');
const { findEmployeeByNumber, findEmployeeById } = require('../libs/employeeLib');
const { initializeReportingProduction, fetchProductionComments } = require('../libs/reportingProductionLib');

// Get all the report by the workspace
const getAllReportsByWorkspaceController = async (req, res) => {
  
  try {  
    // Get data from the request
    const { workspace, isQueue } = req.body;
    
    // Get all the reports by the workspace
    const reports = await fetchReportsByWorkspace(workspace, isQueue);
    
    // Check if the reports empty
    if(reports.length === 0){
      return res.status(200).json({message: "Reports not found", reports:[]})
    }

    // Respond with HTTP 200 (OK) to indicate the request was successful 
    return res.status(200).json({message: "Reports was found", reports});
  } catch (error) {
    console.error('Error in getAllReportsByWorkspaceController:', error.message);
    return res.status(500).json({ message: error.message });
  }
};

// Get all reports
const getAllReportsController = async (req, res) => {
  
  try {
    // Get all the reports from the DB
    const allReports = await Report.find().select('_id serialNumber title status current_workspace');

    if(allReports.length === 0)
      return res.status(200).json({message: "Reports not found", reports:[]});
    return res.status(200).json({message: 'Reports was found', reports: allReports});

  } catch (error) {
    console.error("Error in getAllReportsController:", error.message);
    return res.status(500).json({message: error.message});
  }
};

// Get all components of a report (Used for storage)
const getReportComponentsController = async (req, res) => {
  
  try {
    // Get data from the request
    const { report_id } = req.params;

    // Find the report
    const report = await Report.findById(report_id, { components: 1 });
    if(!report)
      return res.status(404).json({message: "Report not found"});
    
    // Get all components of the report
    const componentsList = await fetchReportComponents(report);                                                         

    // Respond with HTTP 200 (OK) to indicate the request was successful 
    return res.status(200).json({message: 'Components list retrieved successfully', components_list: componentsList});
  } catch (error) {
    console.error("Error in getReportComponentsController:", error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Remove component from report and return to stock (Used for storage)
const removeComponentAndReturnToStockController = async (req, res) => {
  try {
    // Check data
    const { report_id, component_id, stock } = req.body;
    if(stock <= 0 || report_id === undefined || component_id === undefined || stock === undefined){
      if(stock <= 0) 
        console.error("Error in removeComponentAndReturnToStockController: Stock is less or equal to zero");
      if(report_id === undefined) 
        console.error("Error in removeComponentAndReturnToStockController: report_id is undefined");
      if(component_id === undefined) 
        console.error("Error in removeComponentAndReturnToStockController: component_id is undefined");
      if(stock === undefined) 
        console.error("Error in removeComponentAndReturnToStockController: stock is undefined");
      return res.statue(400).json({message: "Invalid parameters"});
    }

    // Check if the report exist
    const report = await Report.findById(report_id).select('components');
    if(!report)
      return res.status(404).json({message: "Report not found"});

    // Report the component and update the stock
    const updatedStock = await removeComponentAndUpdateStock(report, component_id, stock);

    // Respond with HTTP 200 (OK) to indicate the request was successful 
    return res.status(200).json({message: "Component removed successfully", stock: updatedStock});

  } catch (error) {
    console.error('Error in removeComponentAndReturnToStockController:', error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const addComponentsToReport = async (req, res) => {

  try {
    // Get data from the request
    const { employee_id, report_id, components_list, comment } = req.body;

    // Check data
    if(components_list.length <= 0 || employee_id === undefined || report_id === undefined || components_list === undefined || comment === undefined){
      if(components_list.length <= 0) 
        console.error("Error in addComponentsToReport: components_list is less or equal to zero");
      if(employee_id === undefined) 
        console.error("Error in addComponentsToReport: employee_id is undefined");
      if(report_id === undefined) 
        console.error("Error in addComponentsToReport: report_id is undefined");
      if(components_list === undefined) 
        console.error("Error in addComponentsToReport: components_list is undefined");
      if(comment === undefined) 
        console.error("Error in addComponentsToReport: comment is undefined");
      return res.statue(400).json({message: "Invalid parameters"});
    }

    // Check if report exist
    const report = await Report.findById(report_id).select('_id current_workspace reportingStorage_list components');
    if(!report){
      console.error('Error in addComponentsToReport: Report not found');
      return res.status(404).json({message: 'Report not found'});
    }

    // Check if employee exist
    const employee = await findEmployeeById(employee_id);
    if(!employee){
      console.error('Error in addComponentsToReport: Employee not found');
      return res.status(404).json({message: 'Employee not found'});
    }

    // Get the employee reporting
    const employeeReporting = await getEmployeeReporting(report.current_workspace, report.reportingStorage_list, employee_id);
    if(!employeeReporting){
      console.error("Error in addComponentsToReport: User not started a session");
      return {success: false, message: 'employee reporting not found'};
    }

    // Add components to report
    const reporting = employeeReporting.reporting;
    const response = await handleAddComponentsToReport({ report, reporting, components_list, comment });
    
    // Check if succeeded
    if(response.success)
      return res.status(200).json({ message: response.message });
    
  } catch (error) {
    console.error("Error in addComponentsToReport:", error.meesage);
    return res.status(500).json({ message: error.message });
  }
};

// Getting information from DB - All stations
const getReportComments = async (req, res) => {
  try {

    // Get data from the request
    const { report_id } = req.params;

    // Get the report
    const report = await Report.findById(report_id, { current_workspace: 1, reportingStorage_list: 1, reportingProduction_list: 1 });
    if(!report){
      console.error("Error in getReportComments: Report not found");
      return res.status(400).json({message: "Error in getReportComments: Report not found"});
    }

    // Initialize variables
    let comments = null;
    let workspace = report.current_workspace;

    if (workspace === 'Production'){
      const reportingStorage_list = report.reportingStorage_list;                                             // Get reporting list
      comments = await fetchStorageComments(reportingStorage_list);                                           // Get all the comments in this reporting list 
    } else if (workspace === 'Packing'){
      const reportingProduction_list = report.reportingProduction_list;                                       // Get reporting list
      comments = await fetchProductionComments(reportingProduction_list);                                     // Get all the comments in this reporting list 
    } else {
      console.error('Error in getReportComments: Invalid workspace');                                                                 // Invalid workspace
      return res.status(400).json({message: `Error in getReportComments: Invalid workspace. current workspace: ${workspace}`});       // Return status 400
    }
    return res.status(200).json({message: "The comments sent successfully", comments: comments});             // Return status 200

  } catch (error) {
    console.error('Error in getReportComments:', error.message);
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

// Change information in DB - All stations
const transferWorkspace = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Get data from the request
    const { employeeNum, reportId } = req.body;

    // Check data
    if (employeeNum === undefined || reportId === undefined) {
      if(employeeNum === undefined) 
        console.error("Error in transferWorkspace: employeeNum is undefined");
      if(reportId === undefined) 
        console.error("Error in transferWorkspace: reportId is undefined");
      return res.status(400).json({ message: 'Invalid parameters' });
    }

    // Check if the report exist
    const report = await Report.findById(reportId).session(session);
    if (!report) 
      return res.status(404).json({ message: 'Report not found' });

    // Check if the employee exist
    const employee = await findEmployeeByNumber(employeeNum, session);
    if (!employee) 
      return res.status(404).json({ message: 'Employee not found' });

    // Handle the transfer
    await handleTransferWorksplace(employee._id, report, session);
  
    // Commit the session
    await session.commitTransaction();
    session.endSession();

    // Respond with HTTP 200 (OK) to indicate the request was successful  
    return res.status(200).json({ message: 'Workspace transfer processed successfully'});

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error in transferWorkspace:', error.message);
    return res.status(500).json({ message: error.message });
  }
};

// Declare start session
const startSession = async (req, res) => {

  try{
    // Get data from the request
    const {reportId, employeeNum} = req.body;

    // Check data
    if(reportId === undefined || employeeNum === undefined){
      if(reportId === undefined) 
        console.error("Error in startSession: reportId not found");
      if(employeeNum === undefined) 
        console.error("Error in startSession: employeeNum not found");
      return res.status(400).json({ message: "Invalid parameters" });
    }
    
    // Find report
    const report = await Report.findById(reportId);
    if(!report){
      console.error("Error in reportingProductionController: Report not found");
      return res.status(404).json({message: "Report not found"});
    }

    // Find employee
    const employee = await findEmployeeByNumber(employeeNum);
    if(!employee){
      console.error("Error in reportingProductionController: Employee not found");
      return res.status(404).json({message: "Employee not found"});
    }
    
    // Initialize variables
    let isStarted;
    let workspace = report.current_workspace;

    const session = await mongoose.startSession();
    session.startTransaction();

    switch(workspace){
      case 'Storage':
        // Check if the employee already has not finished reporting
        isStarted = await getEmployeeReporting(workspace, report.reportingStorage_list, employee._id);      
        if(isStarted){
          console.error("Error in reportingProductionController: Employee already started a session");
          return res.status(409).json({message: "העובד כבר התחיל דיווח"});
        }

        // Initialize reporting
        const newStorageReporting = await initializeReportingStorage(employee._id, session);

        // Update the report
        report.reportingStorage_list.push(newStorageReporting._id);
        await report.save({session})
        await session.commitTransaction();
        session.endSession();
        return res.status(201).json({message: "Initialized successfully"});

      case 'Production':
        // Check if the employee already has not finished reporting
        isStarted = await getEmployeeReporting(workspace, report.reportingProduction_list, employee._id);
        if(isStarted){
          console.error("Error in reportingProductionController: Employee already started a session");
          return res.status(409).json({message: "העובד כבר התחיל דיווח"});    
        }

        // Initialize reporting
        const newProductionReporting = await initializeReportingProduction(employee._id, session);

        // Update the report
        report.reportingProduction_list.push(newProductionReporting._id);
        await report.save({session})
        await session.commitTransaction();
        session.endSession();
        return res.status(201).json({message: "Initialized successfully"});

      case 'Packing':
        // Check if the employee already has not finished reporting
        isStarted = await getEmployeeReporting(workspace, report.reportingPacking_list, employee._id);
        if(isStarted){
          console.error("Error in reportingProductionController: Employee already started a session");
          return res.status(409).json({message: "העובד כבר התחיל דיווח"});    
        }

        // Initialize reporting
        const newPackingReporting = await initializeReportingPacking(employee._id, session);

        // Update the report
        report.reportingPacking_list.push(newPackingReporting._id);
        await report.save({session})
        await session.commitTransaction();
        session.endSession();
        return res.status(201).json({message: "Initialized successfully"});
    }
  } catch (error){
    console.error("Error in startSession:", error.meesage);
    return res.status(500).json({message: error.message});
  }
}

// Close production reporting Controller 
const closeProductionReportingController = async (req, res) => {
try {
  // Get data from the request
  const {employeeNum, reportId, completed, comment} = req.body;

  // Check data
  if(employeeNum === undefined){
    console.error("Error in CloseProductionReportingController: Employee number is undefined");
    return res.status(400).json({message: "Employee number is undefined"});
  } 
  if(reportId === undefined){
    console.error("Error in CloseProductionReportingController: reportId is undefined");
    return res.status(400).json({message: "reportId is undefined"});
  } 
  if(completed === undefined){
    console.error("Error in CloseProductionReportingController: completed is undefined");
    return res.status(400).json({message: "completed is undefined"});
  } 
  if(comment === undefined){
    console.error("Error in CloseProductionReportingController: comment is undefined");
    return res.status(400).json({message: "comment is undefined"});
  } 
  if(completed <= 0){
    console.error("Error in CloseProductionReportingController: completed are equal or less than zero");
    return res.status(400).json({message: "completed is undefined"});
  } 

  // Check if the employee and report exist 
  const employee = await findEmployeeByNumber(employeeNum);
  if(!employee){
    console.error('Error in closeProductionReportingController: Employee not found');
    return res.status(404).json({message: 'Employee not found'});
  }
  const report = await Report.findById(reportId);
  if(!report){
    console.error('Error in closeProductionReportingController: Report not found');
    return res.status(404).json({message: 'Report not found'});
  }

  // Close the production reporting
  const response = await handleCloseProductionReporting(employee._id, report, completed, comment);

  // Check if succeeded
  if(response.success)
    return res.status(200).json({message: response.message});
  return res.status(500).json({message: 'Unexpected failure'});

} catch (error) {
  console.error('Error in closeProductionReportingController:',error.message);
  return res.status(500).json({message: error.message});
}

}

// Close packing reporting Controller
const closePackingReportingController = async (req, res) => {
  try {
    // Get data from the request
    const {employeeNum, reportId, completed, comment} = req.body;

    // Check data
    if(employeeNum === undefined){
      console.error("Error in CloseProductionReportingController: Employee number is undefined");
      res.status(400).json({message: "Employee number is undefined"});
    } 
    if(reportId === undefined){
      console.error("Error in CloseProductionReportingController: reportId is undefined");
      res.status(400).json({message: "reportId is undefined"});
    } 
    if(completed === undefined){
      console.error("Error in CloseProductionReportingController: completed is undefined");
      res.status(400).json({message: "completed is undefined"});
    } 
    if(comment === undefined){
      console.error("Error in CloseProductionReportingController: comment is undefined");
      res.status(400).json({message: "comment is undefined"});
    } 
    if(completed <= 0){
      console.error("Error in CloseProductionReportingController: completed are equal or less than zero");
      res.status(400).json({message: "completed is undefined"});
    } 
    
  // Check if the employee and report exist 
  const employee = await findEmployeeByNumber(employeeNum);
  if(!employee){
    console.error('Error in closeProductionReportingController: Employee not found');
    return res.status(404).json({message: 'Employee not found'});
  }
  const report = await Report.findById(reportId);
  if(!report){
    console.error('Error in closeProductionReportingController: Report not found');
    return res.status(404).json({message: 'Report not found'});
  }

    // Close the packing reporting
    const response = await handleClosePackingReporting(employee._id, report, completed, comment);

    // Check if succeeded
    if(response.success)
      return res.status(200).json({message: response.message});
    return res.status(500).json({message: 'Unexpected failure'});

  } catch (error) {
    console.error('Error in closePackingReportingController:',error.message);
    return res.status(500).json({message: error.message});
  }
  
  }

// Manager
const calcAverageTimePerProductController = async (req, res) => {

  try {
    // Get data from the request
    const { serialNum } = req.params;
    
    // Check data
    if(serialNum === undefined){
      console.error("Error in CloseProductionReportingController: serialNum is undefined");
      return res.status(400).json({message: "serialNum is undefined"});
    } 

    // Check if report exist
    const report = await Report.findOne({serialNumber: serialNum}).select('reportingProduction_list');
    if(!report){
      console.error("Error in CloseProductionReportingController: report not found");
      return res.status(404).json({message: "Report not found"});
    }

    // Get reporting production list
    const productionList = report.reportingProduction_list;

    // Calculdate the average time
    const averageTime = await calcAverageTime(productionList);
    
    // Respond with HTTP 200 (OK) to indicate the request was successful
    return res.status(200).json({averageTime: averageTime});
  
  } catch (error) {
    console.error('Error in calcAverageTimePerProductController:',error.message);
    return res.status(500).json({message: error.message});
  }
}


// Export the controller functions
module.exports = { 
  getAllReportsByWorkspaceController, 
  getAllReportsController,
  getReportComponentsController, 
  removeComponentAndReturnToStockController, 
  addComponentsToReport, 
  transferWorkspace, 
  getReportComments, 
  startSession,
  closeProductionReportingController,
  closePackingReportingController,
  calcAverageTimePerProductController
 };
