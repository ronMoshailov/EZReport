const mongoose = require('mongoose');

const componentSchema = new mongoose.Schema({
    serialNumber: {
        type: Number,
        required: [true, 'Serial number is required'],
        unique: true
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    stock: {
        type: Number,
        required: [true, 'Stock is required'],
        min: [0, 'Stock cannot be negative'],
        default: 0,
    }
});

const Component = mongoose.model('Component', componentSchema);
module.exports = Component;

