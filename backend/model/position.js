const mongoose = require('mongoose');

// Define the schema
const positionSchema = new mongoose.Schema({

    position_number: {
        type: Number,
        required: true,
        unique: true
    },
        name: {
        type: String,
        required: true
    }
    
});

// Create and export the model
const Position = mongoose.model('Position', positionSchema);
module.exports = Position;
