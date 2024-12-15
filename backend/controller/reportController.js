// Import
const Report = require('../model/Report');  // Import the User model
const mongoose = require('mongoose');

// Import libs
const { removeComponentAndUpdateStock, handleAddComponentsToReport, fetchReportsByWorkspace, fetchReportComponents, handleTransferWorksplace, getEmployeeReporting, handleCloseProductionReporting, handleClosePackingReporting } = require('../libs/reportLib');
const { fetchStorageComments, initializeReportingStorage } = require('../libs/reportingStorageLib');
const { initializeReportingPacking } = require('../libs/reportingPacking');
const { findEmployeeByNumber } = require('../libs/employeeLib');
const { initializeReportingProduction, fetchProductionComments } = require('../libs/reportingProductionLib');

// Getting information from DB
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

// Change information in DB

// Getting information from DB - Storage
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

// Change information in DB - Storage
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

// Getting information from DB - Production

// Change information in DB - Production





// Getting information from DB - Packing

// Change information in DB - Packing



// Getting information from DB - All stations
const getReportComments = async (req, res) => {
  const { report_id } = req.params;
  try {
    const report = await Report.findById(report_id, { current_workspace: 1, reportingStorage_list: 1, reportingProduction_list: 1 });
    if(!report){
      console.error("Error in getReportComments: Report not found");
      return res.status(400).json({message: "Error in getReportComments: Report not found"});
    }

    let comments = null;
    let workspace = report.current_workspace;

    if (workspace === 'Production'){
      const reportingStorage_list = report.reportingStorage_list;
      comments = await fetchStorageComments(reportingStorage_list);
      if(!comments){
        console.error("Error in getReportComments: Comments not found");
        return res.status(400).json({message: "Error in getReportComments: Comments not found"});
      }
    } else if (workspace === 'Packing'){
      const reportingProduction_list = report.reportingProduction_list;
      comments = await fetchProductionComments(reportingProduction_list);
      if(!comments){
        console.error("Error in getReportComments: Comments not found");
        return res.status(400).json({message: "Error in getReportComments: Comments not found"});
      }
    } else {
      console.error('Error in getReportComments: Invalid workspace');
      return res.status(400).json({message: `Error in getReportComments: Invalid workspace. current workspace: ${workspace}`});
    }
    return res.status(200).json({message: "The comments sent successfully", comments: comments});
  } catch (error) {
    if(error.message === "Report not found"){
      console.error("Error in getReportComments: Comments not found");
      return res.status(404).json({message: "Comments not found"});
    }
    console.error('Error in getReportComments:', error.message);
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

// Change information in DB - All stations
const transferWorkspace = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { employeeNum, reportId } = req.body;

    if (employeeNum === undefined || reportId === undefined) {
      if(employeeNum === undefined) throw new Error("Error in transferWorkspace: employeeNum is undefined");
      if(reportId === undefined) throw new Error("Error in transferWorkspace: reportId is undefined");
      return res.status(400).json({ message: 'Invalid parameters' });
    }
    const report = await Report.findById(reportId).session(session);
    if (!report) throw new Error("Report not found");

    const employee = await findEmployeeByNumber(employeeNum, session);
    if (!employee) throw new Error("Employee not found");

    await handleTransferWorksplace(employee._id, report, session);

    await session.commitTransaction();
    session.endSession();
    return res.status(200).json({ message: 'Workspace transfer processed successfully'});


  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error('Error in transferWorkspace:', error.message);

    if (error.message === "Report not found" || error.message === "Employee not found")
      return res.status(404).json({message: error.message});

    return res.status(500).json({ message: error.message });
  }
};

const startSession = async (req, res) => {
  const {reportId, employeeNum} = req.body;

  try{
    if(reportId === undefined || employeeNum === undefined){
      if(reportId === undefined) console.error("Error in startSession: reportId not found");
      if(employeeNum === undefined) console.error("Error in startSession: employeeNum not found");
      return res.status(400).json({ message: "Invalid parameters" });
    }
  
    const report = await Report.findById(reportId);
    if(!report){
      console.error("Error in reportingProductionController: Report not found");
      return res.status(404).json({message: "Report not found"});
    }
    const employee = await findEmployeeByNumber(employeeNum);
    if(!employee){
      console.error("Error in reportingProductionController: Employee not found");
      return res.status(404).json({message: "Employee not found"});
    }
    
    let isStarted;
    let workspace = report.current_workspace;
    const session = await mongoose.startSession();
    session.startTransaction();

    switch(workspace){
      case 'Storage':
        isStarted = await getEmployeeReporting(workspace, report.reportingStorage_list, employee._id);
        if(isStarted){
          console.error("Error in reportingProductionController: Employee already started a session");
          return res.status(409).json({message: "העובד כבר התחיל דיווח"});    
        }
        const newStorageReporting = await initializeReportingStorage(employee._id, session);
        console.warn(newStorageReporting);
        report.reportingStorage_list.push(newStorageReporting._id);
        await report.save({session})
        await session.commitTransaction();
        session.endSession();
        return res.status(201).json({message: "Initialized successfully"});
      case 'Production':
        isStarted = await getEmployeeReporting(workspace, report.reportingProduction_list, employee._id);
        if(isStarted){
          console.error("Error in reportingProductionController: Employee already started a session");
          return res.status(409).json({message: "העובד כבר התחיל דיווח"});    
        }
        const newProductionReporting = await initializeReportingProduction(employee._id, session);
        report.reportingProduction_list.push(newProductionReporting._id);
        await report.save({session})
        await session.commitTransaction();
        session.endSession();
        return res.status(201).json({message: "Initialized successfully"});
      case 'Packing':
        isStarted = await getEmployeeReporting(workspace, report.reportingPacking_list, employee._id);
        if(isStarted){
          console.error("Error in reportingProductionController: Employee already started a session");
          return res.status(409).json({message: "העובד כבר התחיל דיווח"});    
        }
        const newPackingReporting = await initializeReportingPacking(employee._id, session);
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

const isStartedSessionController = async (req, res) => {

  try{
    const { employeeNum, reportId } = req.query;
    const employee = await findEmployeeByNumber(employeeNum);
    if(!employee){
      console.error('Error in isStartedSessionController: Employee not found');
      return res.status(404).json({message: 'Employee not found'});
    }
    const employeeId = employee._id;
  
    const report = await Report.findById(reportId);
    if(!report){
      console.error('Error in isStartedSessionController: Report not found');
      return res.status(404).json({message: 'Report not found'});
    }
    const workspace = report.current_workspace;
    const storageList = report.reportingStorage_list;
    const productionList = report.reportingProduction_list;
    const packingList = report.reportingPacking_list;
    
    switch(workspace){
      case 'Storage':
        const storageReporting = await getEmployeeReporting(workspace, storageList, employeeId);
        if(!storageReporting)
          return res.status(404).json({message: 'Employee not started a session'});
        return res.status(200).json(storageReporting);

        case 'Production':
          const productionReporting = await getEmployeeReporting(workspace, productionList, employeeId);
          if(!productionReporting)
            return res.status(404).json({message: 'Employee not started a session'});
          return res.status(200).json(productionReporting);
        
        case 'Packing':
          const packingReporting = await getEmployeeReporting(workspace, packingList, employeeId);
          if(!packingReporting)
            return res.status(404).json({message: 'Employee not started a session'});
          return res.status(200).json(packingReporting);
    }
  
  } catch(error){
    console.error('Error in isStartedSessionController:', error.message);
    return res.status(500).json({message: 'Server error'});
  }
}

//
const closeProductionReportingController = async (req, res) => {
try {
  const {employeeNum, reportId, completed, comment} = req.body;
  if(employeeNum === undefined){
    console.error("Error in CloseProductionReportingController: Employee number is undefined");
    res.status(404).json({message: "Employee number is undefined"});
  } 
  if(reportId === undefined){
    console.error("Error in CloseProductionReportingController: reportId is undefined");
    res.status(404).json({message: "reportId is undefined"});
  } 
  if(completed === undefined){
    console.error("Error in CloseProductionReportingController: completed is undefined");
    res.status(404).json({message: "completed is undefined"});
  } 
  if(comment === undefined){
    console.error("Error in CloseProductionReportingController: comment is undefined");
    res.status(404).json({message: "comment is undefined"});
  } 
  if(completed <= 0){
    console.error("Error in CloseProductionReportingController: completed are equal or less than zero");
    res.status(404).json({message: "completed is undefined"});
  } 

  const employee = await findEmployeeByNumber(employeeNum);
  const report = await Report.findById(reportId);

  const response = await handleCloseProductionReporting(employee._id, report, completed, comment);
  if(response.success)
    return res.status(200).json({message: response.message});
} catch (error) {
  console.error(error.message);
  return res.status(500).json({message: error.message});
}

}

const closePackingReportingController = async (req, res) => {
  try {
    const {employeeNum, reportId, completed, comment} = req.body;
    if(employeeNum === undefined){
      console.error("Error in CloseProductionReportingController: Employee number is undefined");
      res.status(404).json({message: "Employee number is undefined"});
    } 
    if(reportId === undefined){
      console.error("Error in CloseProductionReportingController: reportId is undefined");
      res.status(404).json({message: "reportId is undefined"});
    } 
    if(completed === undefined){
      console.error("Error in CloseProductionReportingController: completed is undefined");
      res.status(404).json({message: "completed is undefined"});
    } 
    if(comment === undefined){
      console.error("Error in CloseProductionReportingController: comment is undefined");
      res.status(404).json({message: "comment is undefined"});
    } 
    if(completed <= 0){
      console.error("Error in CloseProductionReportingController: completed are equal or less than zero");
      res.status(404).json({message: "completed is undefined"});
    } 
  
    const employee = await findEmployeeByNumber(employeeNum);
    const report = await Report.findById(reportId);

    const response = await handleClosePackingReporting(employee._id, report, completed, comment);
    if(response.success)
      return res.status(200).json({message: response.message});
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({message: error.message});
  }
  
  }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Production
// const reportingProductionController = async (req, res) => {
//   const { reportId, completedCount, employeeNumber, newComment } = req.body;
//   try{
//     if(reportId === undefined || completedCount === undefined || employeeNumber === undefined || completedCount <= 0){
//       if(reportId === undefined) console.error("Error in reportingProductionController: reportId not found");
//       if(completedCount === undefined) console.error("Error in reportingProductionController: completedCount not found");
//       if(completedCount <= 0) console.error("Error in reportingProductionController: completedCount are equal or less than zero");
//       if(employeeNumber === undefined) console.error("Error in reportingProductionController: employeeNumber not found");
//       return res.status(400).json({ message: "Invalid parameters" });
//     }
    
//     const report = await Report.findById(reportId);
//     if(!report){
//       console.error("Error in reportingProductionController: Report not found");
//       return res.status(404).json({message: "Report not found"});
//     }

//     const employee = await findEmployeeByNumber(employeeNumber);
//     if(!employee){
//       console.error("Error in reportingProductionController: Employee not found");
//       return res.status(404).json({message: "Employee not found"});
//     }

//     const newReportingProduction = await startReportingProduction(report, completedCount, employee._id, newComment);
//     return res.status(201).json({message: "The creation production reporting succeeded", reporting: newReportingProduction});
    
//   } catch (error){
//     console.error("Error in reportingProductionController:", error.message);
//     return res.status(500).json({message: error.message});
//   }
// }

// Packing
// const reportingPackingController = async (req, res) => {
//   const { reportId, completedCount, employeeNumber, newComment } = req.body;
//   try{
//     if(reportId === undefined || completedCount === undefined || employeeNumber === undefined || completedCount <= 0){
//       if(reportId === undefined) console.error("Error in reportingProductionController: reportId not found");
//       if(completedCount === undefined) console.error("Error in reportingProductionController: completedCount not found");
//       if(completedCount <= 0) console.error("Error in reportingProductionController: completedCount are equal or less than zero");
//       if(employeeNumber === undefined) console.error("Error in reportingProductionController: employeeNumber not found");
//       return res.status(400).json({ message: "Invalid parameters" });
//     }
    
//     const report = await Report.findById(reportId);
//     if(!report){
//       console.error("Error in reportingProductionController: Report not found");
//       return res.status(404).json({message: "Report not found"});
//     }

//     const employee = await findEmployeeByNumber(employeeNumber);
//     if(!employee){
//       console.error("Error in reportingProductionController: Employee not found");
//       return res.status(404).json({message: "Employee not found"});
//     }

//     const newReportingPacking = await startReportingPacking(report, completedCount, employee._id, newComment);
//     return res.status(201).json({message: "The creation production reporting succeeded", reporting: newReportingPacking});
    
//   } catch (error){
//     console.error("Error in reportingProductionController:", error.message);
//     return res.status(500).json({message: error.message});
//   }
// } 

// Export the controller functions
module.exports = { 
  getAllReports, 
  getReportComponents, 
  removeComponentAndReturnToStock, 
  addComponentsToReport, 
  transferWorkspace, 
  getReportComments, 
  // reportingProductionController,
  // reportingPackingController,
  startSession,
  isStartedSessionController,
  closeProductionReportingController,
  closePackingReportingController
 };
