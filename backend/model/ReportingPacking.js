const mongoose = require('mongoose');

// Define the schema
const ReportingPackingSchema = new mongoose.Schema({
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
    completedCount: {
        type: Number,
        required: [true, 'completed count is required'],
        default: 0,
        min: [0, 'Completed count cannot be negative'],
    },
    comment: {
        type: String,
    },
});

// Create and export the model
const ReportingPacking = mongoose.model('reportingPacking', ReportingPackingSchema);
module.exports = ReportingPacking;
