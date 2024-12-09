const mongoose = require('mongoose');

// Define the schema
const ReportProductionSchema = new mongoose.Schema({
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
    completedCount: {
        type: Number,
    },
    comment: {
        type: String,
    },
});

// Create and export the model
const ReportProduction = mongoose.model('reportProduction', ReportProductionSchema);
module.exports = ReportProduction;
