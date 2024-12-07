const ReportProduction = require('../model/ReportingProduction'); // Replace with the correct path to the Report model
const Report = require('../model/Report'); // Replace with the correct path to the Report model










const createProdReport = async (report_id, employee_id, completedCount, comment, session) => {

  try {
    const date = new Date();
    date.setHours(date.getHours() + 2);
    
    const newReportProduction = new ReportProduction({
    report_id,
    employee_id,
    date,
    completedCount,
    comment,
    });

    // Save the document to the database
    const savedReportProduction = await newReportProduction.save({ session }); // Save with the session
    return savedReportProduction;
    
        // return 
    } catch (error) {
      console.error('Error fetching comments from reportstorage:', error.message);
      throw error;
    }
  };


const fetchCommentsFromReportProduction = async (reportingProduction_list) => {
  try {
    const comments = await ReportProduction.find(
      { _id: { $in: reportingProduction_list } }, // Match `_id` with the provided list
      { comment: 1, _id: 0 } // Project only the `comment` field
    );
    return comments.map((item) => item.comment); // Extract only the `comment` field
  } catch (error) {
    console.error('Error fetching comments from reportstorage:', error.message);
    throw error;
  }
};


const fetchReportProductionList = async (report_id) => {
  try {

    const report = await Report.findById(report_id, { reportingProduction_list: 1 });
    if (!report) {
      throw new Error('Report not found');
    }
    return report.reportingProduction_list;
  } catch (error) {
    console.error('Error fetching report storage list:', error.message);
    throw error;
  }
};

  module.exports = { createProdReport, fetchCommentsFromReportProduction, fetchReportProductionList };
