const Workspace = require('../model/Workspace');

// Find workspace by number workspace
const findWorkspaceByNumber = async (workspaceNumber) => {
  try {
    const workspace = await Workspace.findOne({ workspace_number: workspaceNumber });
    return workspace;      
  } catch (error) {
    console.error('Error in findWorkspaceByNumber:', error.message);
    throw error;
  }
};
  
module.exports = { findWorkspaceByNumber };
  