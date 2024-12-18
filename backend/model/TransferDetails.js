const mongoose = require('mongoose');

// Define the schema
const transferDetailsSchema = new mongoose.Schema({
    send_worker_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: [true, 'Sending employee id is required'],
    },
    send_date: {
        type: Date,
        required: [true, 'Sending date is required'],
    },
    send_workspace: {
        type: String,
        required: [true, 'Sending workspace is required'],
    },
    received_worker_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: [true, 'Received employee id is required'],
        default: null,
    },
    received_date: {
        type: Date,
        required: [true, 'Received date is required'],
        default: null,
    },
    received_workspace: {
        type: String,
        required: [true, 'Received workspace is required'],
        default: null,
    }
});

// Create and export the model
const TransferDetails = mongoose.model('transferDetails', transferDetailsSchema);
module.exports = TransferDetails;
