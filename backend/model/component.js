const mongoose = require('mongoose');

// Define the schema
const componentSchema = new mongoose.Schema({
    component_num: {
        type: Number,
        required: true
    },
    component_name: {
        type: String,
        required: true
    },
    component_count: {
        type: Number,
        required: true
    }
});

// Create and export the model
const Component = mongoose.model('Component', componentSchema);
module.exports = Component;
