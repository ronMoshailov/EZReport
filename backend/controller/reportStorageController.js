const ReportStorage = require('../model/ReportStorage');

const addReportStorage = async (req, res) => {
  const { employee_id, components_list, comment } = req.body;
  const date = new Date();

  // console.log('Received components_list:', components_list);

  try {
    const newReport = new ReportStorage({
      employee_id,
      date,
      components_list,
      comment
    });

    await newReport.save();
    console.log('New reportStorage saved successfully');

    res.status(201).json({
      message: 'New reportStorage added successfully',
      report: newReport
    });
  } catch (error) {
    console.error('Error adding reportStorage:', error);
    res.status(500).json({ message: 'Failed to add reportStorage', error: error.message });
  }
};

module.exports = { addReportStorage };
