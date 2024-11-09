const mongoose = require('mongoose');

// Define the schema
const componentSchema = new mongoose.Schema({
    serialNumber: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    }
});

// Create and export the model
const Component = mongoose.model('Component', componentSchema);
module.exports = Component;

