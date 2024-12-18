const mongoose = require('mongoose');

// Define the schema
const workspaceSchema = new mongoose.Schema({

    workspace_number: {
        type: Number,
        required: [true, 'Number workspace is required'],
        unique: true,
    },
    name: {
        type: String,
        required: [true, 'Workspace name is required'],
        unique: true,
    }
    
});

// Create and export the model
const Workspace = mongoose.model('Workspace', workspaceSchema);
module.exports = Workspace;
