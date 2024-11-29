const { createNewTransition, createTransition } = require('../libs/transferDetailsLib');

/**
 * Controller to send workspace.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const sendWorkspace = async (req, res) => {
  const { send_worker_id, send_workspace, isReceived } = req.body;

  try {
    // Call the lib to create a new transition
    const newTransition = await createTransition({ send_worker_id, send_workspace, isReceived });

    res.status(200).json({
      message: 'Transition added to report transferDetails successfully',
      newTransition_id: newTransition._id,
    });
  } catch (error) {
    console.error('Error adding transition to report:', error.message);

    // Handle validation errors differently from internal server errors
    const statusCode = error.message.includes('Missing required fields') ? 400 : 500;
    res.status(statusCode).json({ message: error.message });
  }
};

module.exports = { sendWorkspace };
