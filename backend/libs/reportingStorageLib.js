const Report = require('../model/Report'); // Replace with the correct path to the Report model
const ReportingStorage = require('../model/ReportingStorage'); // Replace with the correct path to the ReportStorage model


// Return all the comments of the storage reporting
const fetchStorageComments = async (reportingStorage_list) => {
  const comments = (
    await ReportingStorage.find(
      { _id: { $in: reportingStorage_list } }, // Match `_id` with the provided list
      { comment: 1, _id: 0 } // Project only the `comment` field
    )
  ).filter((item) => item.comment != null); // Remove entries with null or undefined comments
  
  if(!comments){
    console.error("Error in fetchStorageComments: Comments not found");
    throw new Error("Comments not found");
  }
  return comments.map((item) => item.comment); // Extract only the `comment` field
};

// Initialize storage reporting
const initializeReportingStorage = async (employee_id, session) => {
  try{
    const date = new Date();
    date.setHours(date.getHours() + 2);

    const newRoportingStorage = new ReportingStorage({
      employee_id,
      start_date: date
    });
    
    const newReporting = await newRoportingStorage.save({session});
    return newReporting;
  } catch (error){
    console.error("Error in initializeReportingStorage:", error.message);
    throw error;
  }
};

module.exports = {
  fetchStorageComments,
  initializeReportingStorage,
};
