const Report = require('../model/Report'); // Replace with the correct path to the Report model
const ReportingStorage = require('../model/ReportingStorage'); // Replace with the correct path to the ReportStorage model


const fetchReportStorageList = async (report_id) => {
    const report = await Report.findById(report_id, { reportingStorage_list: 1 });
    if (!report) {
      console.error("Error in fetchReportStorageList: Report not found");
      throw new Error("Report not found");
    }
    return report.reportingStorage_list;
};

const fetchCommentsFromReportStorage = async (reportingStorage_list) => {
    const comments = await ReportingStorage.find(
      { _id: { $in: reportingStorage_list } }, // Match `_id` with the provided list
      { comment: 1, _id: 0 } // Project only the `comment` field
    );
    if(!comments){
      console.error("Error in fetchCommentsFromReportStorage: Comments not found");
      throw new Error("Comments not found");
    }
    return comments.map((item) => item.comment); // Extract only the `comment` field
};

const createReportingStorage = async (employee_id, date, components_list, comment, session) => {
  try{
    const newReportingStorage = new ReportingStorage({
      employee_id,
      start_date: date,
      components_list,
      comment,
    });
    
    const newReporting = await newReportingStorage.save({ session });
    return newReporting._id;
  } catch(error){
    console.error("Error in createReportingStorage:", error.message);
    throw new Error("Failed to create new reporting storage");
  }
};

module.exports = {
  fetchReportStorageList,
  fetchCommentsFromReportStorage,
  createReportingStorage
};
