const mongoose = require('mongoose');

// Define the schema
const ReportProductionSchema = new mongoose.Schema({
    report_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Report',
        required: true
    },
    employee_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    completedCount: {
        type: Number,
        required: true
    },
    comment: {
        type: String,
    },
});

// Create and export the model
const ReportProduction = mongoose.model('reportProduction', ReportProductionSchema);
module.exports = ReportProduction;
