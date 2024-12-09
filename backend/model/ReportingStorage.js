const mongoose = require('mongoose');

// Define the schema
const reportStorageSchema = new mongoose.Schema({
    employee_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    start_date: {
        type: Date,
        required: true
    },
    end_date: {
        type: Date,
    },
    components_list: [{
        component: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Component', // Refers to the Component model
            required: true
        },
        stock: {
            type: Number,
            required: true
        }
    }],
    comment: {
        type: String,
    },
});

// Create and export the model
const reportStorage = mongoose.model('reportingStorage', reportStorageSchema);
module.exports = reportStorage;
