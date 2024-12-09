const mongoose = require('mongoose');
const { STATUS, STATIONS } = require('./enums');

// Define the Report schema
const reportSchema = new mongoose.Schema({
    serialNumber: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    components: [{
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
    status: {
        type: String,
        enum: Object.values(STATUS),  // Enforce valid values from STATUS enum
        default: STATUS.OPEN
    },
    current_workspace: {
        type: String,
        enum: Object.values(STATIONS)  // Enforce valid values from STATIONS enum
    },
    producedCount: {
        type: Number,
        default: 0
    },
    packedCount: {
        type: Number,
        default: 0
    },
    orderedCount: {
        type: Number,
        required: true
    },
    reportingStorage_list: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ReportingStorage',
        default: [] 
    }],
    reportingProduction_list: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ReportingProduction',
        default: [] 
    }],
    reportingPacking_list: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ReportingPacking',
        default: [] 
    }],
    transferDetails: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'transferDetails'  // Refers to TransitionBetweenStations model
    }],
    openDate: {
        type: Date,
        default: Date.now
    },
    closeDate: {
        type: Date
    },
    inQueue: {
        type: Boolean,
        default: true
    },
});

// Create and export the Report model
const Report = mongoose.model('Report', reportSchema);
module.exports = Report;
