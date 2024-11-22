const mongoose = require('mongoose');
const { STATUS, STATIONS } = require('./enums');

// Define the Report schema
const reportSchema = new mongoose.Schema({
    // id: {
    //     type: String,
    //     required: true
    // },
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
    report_production_list: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ReportProduction', // Refers to the ReportProduction model
        default: [] // Initialize as an empty array by default
    }],
    // product_name: {
    //     type: String,
    //     required: true
    // },
    completed: {
        type: Number,
        default: 0
    },
    ordered: {
        type: Number,
        required: true
    },
    // mini_report_list: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'MiniReport'  // Refers to the MiniReport model
    // }],
    report_storage_list: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ReportStorage'  // Refers to the MiniReport model
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
    // activity: {
    //     type: Array,
    //     default: []  // Placeholder for future activities array
    // },
    enable: {
        type: Boolean,
        default: true
    },
    lastComment: {
        type: String,
    }
});

// Create and export the Report model
const Report = mongoose.model('Report', reportSchema);
module.exports = Report;
