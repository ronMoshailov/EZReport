const ReportProduction = require('../model/ReportingProduction'); // Replace with the correct path to the Report model
const Report = require('../model/Report'); // Replace with the correct path to the Report model

const fetchProductionComments = async (reportingProduction_list) => {
  const comments = (
    await ReportProduction.find(
      { _id: { $in: reportingProduction_list } }, // Match `_id` with the provided list
      { comment: 1, _id: 0 } // Project only the `comment` field
    )
  ).filter((item) => item.comment != null); // Remove entries with null or undefined comments

  if(!comments){
    console.error("Error in fetchProductionComments: Comments not found");
    throw new Error("Comments not found");
  }
  return comments.map((item) => item.comment); // Extract only the `comment` field
};

const fetchReportProductionList = async (report_id) => {
  try {

    const report = await Report.findById(report_id, { reportingProduction_list: 1 });
    if (!report) {
      throw new Error('Report not found');
    }
    return report.reportingProduction_list;
  } catch (error) {
    console.error('Error fetching report Production list:', error.message);
    throw error;
  }
};

const initializeReportingProduction = async (employee_id, session) => {
  try{
    const date = new Date();
    date.setHours(date.getHours() + 2);

    const newReporting = new ReportProduction({
      employee_id,
      start_date: date
    });
    
    await newReporting.save({session});
    return newReporting;
  } catch (error){
    console.error("Error in initializeReportingProduction:", error.message);
    throw error;
  }
};


  module.exports = { fetchProductionComments, fetchReportProductionList, initializeReportingProduction };



  // const createProdReport = async (report_id, employee_id, completedCount, comment, session) => {

//   try {
//     const date = new Date();
//     date.setHours(date.getHours() + 2);
    
//     const newReportProduction = new ReportProduction({
//     report_id,
//     employee_id,
//     date,
//     completedCount,
//     comment,
//     });

//     // Save the document to the database
//     const savedReportProduction = await newReportProduction.save({ session }); // Save with the session
//     return savedReportProduction;
    
//         // return 
//     } catch (error) {
//       console.error("Error in createProdReport:", error.message);
//       throw error;
//     }
//   };