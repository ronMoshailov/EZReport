const mongoose = require('mongoose');

// Define the schema
const employeeSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
    },
    number_employee: {
        type: Number,
        required: [true, 'Number employee is required'],
        unique: true
    },
});

// Create and export the model
const Employee = mongoose.model('Employee', employeeSchema);
module.exports = Employee;
