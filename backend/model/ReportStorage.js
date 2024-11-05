const mongoose = require('mongoose');

// Define the schema
const reportStorageSchema = new mongoose.Schema({
    employee_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    components_list: [{
        component: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Component', // Refers to the Component model
            required: true
        },
        component_count: {
            type: Number,
            required: true
        }
    }]
});

// Create and export the model
const reportStorage = mongoose.model('reportStorage', reportStorageSchema);
module.exports = reportStorage;
