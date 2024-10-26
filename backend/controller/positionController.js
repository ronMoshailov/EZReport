const Position = require('../model/Position');
const TransitionBetweenStations = require('../model/TransitionBetweenStations');

const isNumberPositionExist = async (req, res) => {
  const positionNumber = parseInt(req.params.id, 10);
  console.log(`position number the server recieved: ${positionNumber}`);
  try {
      const position = await Position.findOne({ position_number: positionNumber });
      console.log('position that returned from mongoDB: \n' + position + '\n');
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

const nextStation = async (req, res) => {
    const { send_worker_name, send_date, send_station, receive_worker, receive_date, receive_station, isFinished } = req.body;

    try {
        // Create a new document in transitionBetweenStations with all required fields
        const newTransition = await TransitionBetweenStations.create({
            send_worker_name,
            send_date,
            send_station,
            receive_worker,           // Can be null
            receive_date,             // Can be null
            receive_station,          // Can be null
            isFinished: isFinished || false  // Set as false if not provided
        });

        res.status(200).json(newTransition);
        console.log('The transition entry was created and sent back.');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Export the controller functions
module.exports = { nextStation, isNumberPositionExist };
