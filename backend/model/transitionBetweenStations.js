const mongoose = require('mongoose');

// Define the schema
const transitionBetweenStationsSchema = new mongoose.Schema({
    send_worker_name: {
        type: String,
        required: true
    },
    send_date: {
        type: Date,
        required: true
    },
    send_station: {
        type: String,
        required: true
    },
    receive_worker: {
        type: String,
        required: true
    },
    receive_date: {
        type: Date,
        required: true
    },
    receive_station: {
        type: String,
        required: true
    }
});

// Create and export the model
const TransitionBetweenStations = mongoose.model('TransitionBetweenStations', transitionBetweenStationsSchema);
module.exports = TransitionBetweenStations;
