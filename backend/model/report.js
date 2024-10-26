const mongoose = require('mongoose');
const { STATUS, STATIONS } = require('./enums');
const MiniReport = require('./miniReport');
const TransitionBetweenStations = require('./TransitionBetweenStations');
const Component = require('./component');

// Define the Report schema
const reportSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    components: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Component'  // Refers to the Component model
    }],
    status: {
        type: String,
        enum: Object.values(STATUS),  // Enforce valid values from STATUS enum
        default: STATUS.OPEN
    },
    current_station: {
        type: String,
        enum: Object.values(STATIONS)  // Enforce valid values from STATIONS enum
    },
    product_num: {
        type: String,
        required: true
    },
    product_name: {
        type: String,
        required: true
    },
    product_completed_count: {
        type: Number,
        default: 0
    },
    product_ordered_count: {
        type: Number,
        required: true
    },
    mini_report_list: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MiniReport'  // Refers to the MiniReport model
    }],
    history: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TransitionBetweenStations'  // Refers to TransitionBetweenStations model
    }],
    openDate: {
        type: Date,
        default: Date.now
    },
    closeDate: {
        type: Date
    },
    activity: {
        type: Array,
        default: []  // Placeholder for future activities array
    },
    enable: {
        type: Boolean,
    }

    
});

// Create and export the Report model
const Report = mongoose.model('Report', reportSchema);
module.exports = Report;
