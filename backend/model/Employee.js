const mongoose = require('mongoose');

// Define the schema
const employeeSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    number_employee: {
        type: Number,
        required: true
    },
});

// Create and export the model
const Employee = mongoose.model('Employee', employeeSchema);
module.exports = Employee;
