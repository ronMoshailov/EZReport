const mongoose = require('mongoose');
const { STATUS, STATIONS } = require('./enums');

// Define the Report schema
const reportSchema = new mongoose.Schema({
    serialNumber: {
        type: String,
        required: [true, 'Serial number is required'],
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
    },
    components: [{
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
    status: {
        type: String,
        enum: Object.values(STATUS),  // Enforce valid values from STATUS enum
        default: STATUS.OPEN
    },
    current_workspace: {
        type: String,
        enum: Object.values(STATIONS),  // Enforce valid values from STATIONS enum
        default: STATIONS.STORAGE,
    },
    producedCount: {
        type: Number,
        required: [true, 'Produced count is required'],
        min: [0, 'Produced count cannot be negative'],
        default: 0,
    },
    packedCount: {
        type: Number,
        required: [true, 'Packed count is required'],
        min: [0, 'Packed count cannot be negative'],
        default: 0
    },
    orderedCount: {
        type: Number,
        required: [true, 'Ordered count is required'],
        min: [0, 'Ordered count cannot be negative'],
        default: 0
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
        ref: 'transferDetails'
    }],
    openDate: {
        type: Date,
        required: [true, 'Open date is required'],
        default: Date.now,
    },
    closeDate: {
        type: Date,
        default: null,
    },
    inQueue: {
        type: Boolean,
        default: true,
        required: [true, 'inQueue is required']
    },
});

const Report = mongoose.model('Report', reportSchema);
module.exports = Report;
