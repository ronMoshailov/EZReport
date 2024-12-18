const mongoose = require('mongoose');

// Define the schema
const reportingStorageSchema = new mongoose.Schema({
    employee_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: [true, 'Employee number is required']
    },
    start_date: {
        type: Date,
        required: [true, 'Open date is required'],
        default: Date.now,
    },
    end_date: {
        type: Date,
        default: null,
    },
    components_list: [{
        component: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Component', // Refers to the Component model
            required: [true, 'Component is required'],
        },
        stock: {
            type: Number,
            required: [true, 'Stock is required'],
            min: [0, 'Stock should not be negative']
        }
    }],
    comment: {
        type: String,
    },
});

// Create and export the model
const reportingStorage = mongoose.model('reportingStorage', reportingStorageSchema);
module.exports = reportingStorage;
