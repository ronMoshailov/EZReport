const TransferDetails = require('../model/TransferDetails');
const { findWorkspaceByNumber } = require('../libs/workspaceLib');
const Report = require('../model/Report');

/**
 * Controller to check if a workspace exists.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const isWorkspaceExist = async (req, res) => {
    const workspaceNumber = parseInt(req.params.id, 10);
    console.log(`The data that received in 'isWorkspaceExist' is: [workspaceNumber: ${workspaceNumber}]`);

    try {
      const workspace = await findWorkspaceByNumber(workspaceNumber);
  
      if (workspace) {
        return res.status(200).json({ name: workspace.name });
      } else {
        return res.status(404).json({ error: 'Workspace not found.' });
      }
    } catch (error) {
      console.error('Error checking workspace:', error.message);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
  








// need to order



















const receivedWorkspace = async (req, res) => {
    const { transferdetails_id, received_worker_id, received_workspace, report_id } = req.body;
    received_date = new Date().toISOString();

    // console.log(transferdetails_id);
    console.log(`The received data is: transferdetails: ${transferdetails_id}, received_worker_id: ${received_worker_id}, received_workspace:${received_workspace}`);
    if (!received_worker_id || !received_workspace) {
        return res.status(400).json({ message: 'Missing required fields: send_worker_id, received_date, or send_workspace.' });
    }

    try {
        // Retrieve the transition by its ID and populate `transferDetails`
        console.log('Trying to find transfer details.');
        const transition = await TransferDetails.findById(transferdetails_id);

        // If no transition is found, return a 404 response
        if (!transition) {
            return res.status(404).json({ message: 'transitionDetails not found' });
        }

        console.log('Trying to insert the new data.');
        transition.received_worker_id = received_worker_id;
        transition.received_date = received_date;
        transition.received_workspace = received_workspace;
        transition.isReceived = !transition.isReceived;

        console.log('Trying to save.');
        await transition.save();

        // Respond with the updated transition data
        res.status(200).json({
            message: 'Transition updated successfully',
            updatedTransition: transition
        });

        // Find the report and toggle the `enable` field
        const report = await Report.findById(report_id);

        if (!report) {
          return res.status(404).json({ message: 'Report not found' });
        }

        // Toggle the enable field
        report.enable = !report.enable;
        await report.save();

    } catch (error) {
        console.error('Error updating transition:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Export the controller functions
module.exports = { isWorkspaceExist , receivedWorkspace }
