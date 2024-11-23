const ReportProduction = require('../model/ReportProduction'); // Replace with the correct path to the Report model
const Report = require('../model/Report'); // Replace with the correct path to the Report model
const mongoose = require('mongoose'); // Import mongoose for sessions
const { findEmployeeById } = require('./employeeLib');
/**
 * Creates a new production report with a transaction.
 * @param {string} report_id - The ID of the report to update.
 * @param {string} employee_id - The ID of the employee creating the report.
 * @param {number} completedCount - The number of completed items to add.
 * @param {string} comment - Optional comment for the report.
 * @returns {Object} - The newly created ReportProduction document.
 * @throws {Error} - Throws an error if any step fails.
 */
const createProdReport = async (report_id, employee_id, completedCount, comment) => {
  const session = await mongoose.startSession(); // Start a session for the transaction
console.log(1);
  try { 
        session.startTransaction(); // Begin the transaction

        const date = new Date();
        console.log(2);

        employee_id = await findEmployeeById(employee_id);
        employee_id = employee_id._id;
        console.log('employee_id');
        console.log(employee_id);
        
        console.log(3);
        // Create the new reportProduction document
        const newReportProduction = new ReportProduction({
        report_id,
        employee_id,
        date,
        completedCount,
        comment, // Optional: Only included if provided
        });

        // Save the document to the database
        const savedReportProduction = await newReportProduction.save({ session }); // Save with the session

        const report = await Report.findById(report_id).session(session); // Use the session to ensure transactional consistency

        if (!report) throw new Error(`Report with ID ${report_id} not found`);
        
        // Ensure `report_production_list` is initialized
        if (!Array.isArray(report.report_production_list)) {
          report.report_production_list = []; // Initialize as an empty array if undefined
        }

        if (report.completed + completedCount > report.ordered){
          console.log(`The total amount is greater than the ordered amount.`);
          throw new Error(`The total amount is greater than the ordered amount.`);
        }
        report.report_production_list.push(savedReportProduction._id); // Add directly instead of `findByIdAndUpdate`
        report.completed += completedCount;
        report.markModified('report_production_list'); // Ensure Mongoose detects the change
        await report.save({ session }); // Save the updated report with the session
        
        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        return savedReportProduction; // Return the saved ReportProduction document
        // return 
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error('Error fetching comments from reportstorage:', error.message);
      throw error;
    }
  };

  module.exports = { createProdReport };
