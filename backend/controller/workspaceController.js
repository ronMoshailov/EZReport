const Workspace = require('../model/Workspace');
const TransferDetails = require('../model/TransferDetails');
const Report = require('../model/Report')

// Check if workspace exist
const isWorkspaceExist = async (req, res) => {

  const workspaceNumber = parseInt(req.params.id, 10);

  try {
      const workspace = await Workspace.findOne({ workspace_number: workspaceNumber });

      if (workspace) {
          return res.status(200).json({ name: workspace.name });
      } else if (workspace === undefined) {
          return res.status(400).json({ undefined });
      }

    } catch (error) {
      console.error('Error querying MongoDB:', error);
      return res.status(500).json({ error: 'Internal server error' });
  }
};

const sendWorkspace = async (req, res) => {
    const { send_worker_id, send_workspace, isReceived } = req.body;
    send_date = new Date().toISOString();
    
    // Basic validation for required fields
    console.log(`Starting server send data. The received data is [send_worker_id: ${send_worker_id}, send_workspace: ${send_workspace}]`);
    if (!send_worker_id || !send_workspace) {
        return res.status(400).json({ message: 'Missing required fields: send_worker_id, or send_workspace.' });
    }

    try {
        // Creating document
        console.log('Creating a new transition document...');
        const newTransition = await TransferDetails.create({
            send_worker_id,
            send_date,
            send_workspace,
            isReceived: isReceived || false
        });
        console.log('New transition created:', newTransition);

        res.status(200).json({
            message: 'Transition added to report transferDetails successfully',
            newTransition_id: newTransition._id
        });
    } catch (err) {
        console.error('Error adding transition to report:', err);
        res.status(500).json({ message: `Internal server error: ${err.message}` });
    }
};


















const receivedWorkspace = async (req, res) => {
    const { transferdetails_id, received_worker_id, received_workspace } = req.body;
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


        // // Get the last transition in the transferDetails array
        // const lastTransitionId = report.transferDetails[report.transferDetails.length - 1];
        // if (!lastTransitionId) {
        //     return res.status(404).json({ message: 'No transitions found in transferDetails' });
        // }

        // // Step 3: Retrieve the last transition document by its ID
        // const unfinishedTransition = await TransferDetails.findById(lastTransitionId);

        // if (!unfinishedTransition || unfinishedTransition.isReceived) {
        //     return res.status(404).json({ message: 'No unfinished transitions found' });
        // }

        // // Step 4: Update the fields in the transition
        // unfinishedTransition.received_worker_id = received_worker_id;
        // unfinishedTransition.receive_date = receive_date;
        // unfinishedTransition.received_workspace = received_workspace;
        // unfinishedTransition.isReceived = true;

        // // Step 5: Save the updated transition
        // await unfinishedTransition.save();

        // const updateReport = await Report.findById(report_id);


        // // Step 6: Respond with the updated transition data
        // res.status(200).json({
        //     message: 'Transition updated successfully',
        //     updatedTransition: unfinishedTransition
        // });
    } catch (error) {
        console.error('Error updating transition:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Export the controller functions
module.exports = { sendWorkspace, isWorkspaceExist , receivedWorkspace }
