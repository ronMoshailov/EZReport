const mongoose = require('mongoose');

// Define the schema
const positionSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    
    password: {
        type: Number,
        required: true
    },
    
    position: {
        type: Number,
        required: true
    },
});

// Create and export the model
const Position = mongoose.model('Position', positionSchema);
module.exports = Position;
