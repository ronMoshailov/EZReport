const mongoose = require('mongoose');

// Define the schema
const miniReportSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    worker_name: {
        type: String,
        required: true
    },
    completed_count: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    last_modified_worker: {
        type: String,
        required: true
    }
});

// Create and export the model
const MiniReport = mongoose.model('MiniReport', miniReportSchema);
module.exports = MiniReport;
