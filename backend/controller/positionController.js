const Position = require('../model/Position');
const TransitionBetweenStations = require('../model/TransitionBetweenStations');
const Report = require('../model/Report')

const isPositionExist = async (req, res) => {
  const positionNumber = parseInt(req.params.id, 10);
  // console.log(`position number the server recieved: ${positionNumber}`);
  try {
      const position = await Position.findOne({ position_number: positionNumber });
      /* console.log('position that returned from mongoDB: \n' + position + '\n'); */
      if (position) {
          return res.status(200).json({ exists: true, name: position.name });
      } else {
          return res.status(200).json({ exists: false });
      }
  } catch (error) {
      console.error('Error querying MongoDB:', error);
      return res.status(500).json({ error: 'Internal server error' });
  }
};

const sendStation = async (req, res) => {
    const { idReport, send_worker_name, send_date, send_station, isFinished } = req.body;
    console.log(`Starting server send data`);
    // Basic validation for required fields
    if (!send_worker_name || !send_date || !send_station) {
        return res.status(400).json({ message: 'Missing required fields: send_worker_name, send_date, or send_station.' });
    }

    try {
        console.log('Creating a new transition document...');

        const newTransition = await TransitionBetweenStations.create({
            send_worker_name,
            send_date,
            send_station,
            isFinished: isFinished || false
        });

        console.log('New transition created:', newTransition);

        // Find report by ID and add the transition
        const report = await Report.findById(idReport);
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        report.history.push(newTransition._id);
        await report.save();

        res.status(200).json({
            message: 'Transition added to report history successfully',
            newTransition,
            report
        });
    } catch (err) {
        console.error('Error adding transition to report:', err);
        res.status(500).json({ message: `Internal server error: ${err.message}` });
    }
};

const receiveStation = async (req, res) => {
    const { idReport, receive_worker, receive_date, receive_station } = req.body;

    console.log('Attempting to receive data for report with ID:', idReport);

    try {
        // Step 1: Retrieve the report by its ID and populate `history`
        const report = await Report.findById(idReport).populate('history');

        // If no report is found, return a 404 response
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        // Step 2: Get the last transition in the history array
        const lastTransitionId = report.history[report.history.length - 1];
        if (!lastTransitionId) {
            return res.status(404).json({ message: 'No transitions found in history' });
        }

        // Step 3: Retrieve the last transition document by its ID
        const unfinishedTransition = await TransitionBetweenStations.findById(lastTransitionId);

        if (!unfinishedTransition || unfinishedTransition.isFinished) {
            return res.status(404).json({ message: 'No unfinished transitions found' });
        }

        // Step 4: Update the fields in the transition
        unfinishedTransition.receive_worker = receive_worker;
        unfinishedTransition.receive_date = receive_date;
        unfinishedTransition.receive_station = receive_station;
        unfinishedTransition.isFinished = true;

        // Step 5: Save the updated transition
        await unfinishedTransition.save();

        const updateReport = await Report.findById(idReport);


        // Step 6: Respond with the updated transition data
        res.status(200).json({
            message: 'Transition updated successfully',
            updatedTransition: unfinishedTransition
        });
    } catch (error) {
        console.error('Error updating transition:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Export the controller functions
module.exports = { sendStation, isPositionExist , receiveStation }
