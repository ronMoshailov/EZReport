const mongoose = require('mongoose');

// Define the schema
const transferDetailsSchema = new mongoose.Schema({
    send_worker_id: {
        type: String,
        required: true
    },
    send_date: {
        type: Date,
        required: true
    },
    send_workspace: {
        type: String,
        required: true
    },
    received_worker_id: {
        type: String,
        default: null,
    },
    received_date: {
        type: Date,
        default: null,
    },
    received_workspace: {
        type: String,
        default: null,
    },
    isReceived: {
        type: Boolean,
        required: true,
        default: true
    }
});

// Create and export the model
const TransferDetails = mongoose.model('transferDetails', transferDetailsSchema);
module.exports = TransferDetails;
