const ReportingPacking = require('../model/ReportingPacking'); // Replace with the correct path to the Report model

const createPackingReporting = async (report_id, employee_id, completedCount, comment, session) => {

    try {
      const date = new Date();
      date.setHours(date.getHours() + 2);
      
      const newPackingReporting = new ReportingPacking({
      report_id,
      employee_id,
      date,
      completedCount,
      comment,
      });
  
      // Save the document to the database
      const savedPackingReporting = await newPackingReporting.save({ session }); // Save with the session
      return savedPackingReporting;
      
        // return 
      } catch (error) {
        console.error("Error in createPackingReporting:", error.message);
        throw error;
      }
    };
  
    module.exports = {
        createPackingReporting
    }