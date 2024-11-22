const Report = require('../model/Report'); // Replace with the correct path to the Report model
const ReportStorage = require('../model/ReportStorage'); // Replace with the correct path to the ReportStorage model

/**
 * Fetches the report's `report_storage_list` by its ID.
 * @param {string} report_id - The ID of the report.
 * @returns {Promise<Array>} - Array of report_storage IDs.
 * @throws {Error} - Throws an error if the report is not found.
 */
const fetchReportStorageList = async (report_id) => {
  try {
    const report = await Report.findById(report_id, { report_storage_list: 1 });
    if (!report) {
      throw new Error('Report not found');
    }
    return report.report_storage_list;
  } catch (error) {
    console.error('Error fetching report storage list:', error.message);
    throw error;
  }
};

/**
 * Fetches comments from the `reportstorage` collection based on a list of IDs.
 * @param {Array} reportStorageIds - Array of `reportstorage` IDs.
 * @returns {Promise<Array>} - Array of comments.
 * @throws {Error} - Throws an error if the query fails.
 */
const fetchCommentsFromReportStorage = async (reportStorageIds) => {
  try {
    const comments = await ReportStorage.find(
      { _id: { $in: reportStorageIds } }, // Match `_id` with the provided list
      { comment: 1, _id: 0 } // Project only the `comment` field
    );
    return comments.map((item) => item.comment); // Extract only the `comment` field
  } catch (error) {
    console.error('Error fetching comments from reportstorage:', error.message);
    throw error;
  }
};

module.exports = {
  fetchReportStorageList,
  fetchCommentsFromReportStorage,
};
