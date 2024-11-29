const { createProdReport } = require('../libs/ReportProduction'); // Adjust the path as needed

/**
 * Controller for creating a production report.
 * @param {Object} req - The request object containing the production data.
 * @param {Object} res - The response object to send the result or errors.
 */
const createProductionReport = async (req, res) => {
  try {
    const { report_id, employee_id, completedCount, comment } = req.body;

    // Validate required fields
    if (!report_id || !employee_id || !completedCount) {
      return res.status(400).json({ message: 'Missing required fields: report_id, employee_id, or completedCount' });
    }

    // Call the service function to create the production report
    const productionReport = await createProdReport(report_id, employee_id, completedCount, comment);

    // Return the newly created report as a response
    res.status(201).json(productionReport);
  } catch (error) {
    console.error('Error creating production report:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { createProductionReport };
