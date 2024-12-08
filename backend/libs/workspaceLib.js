const Workspace = require('../model/Workspace');


const findWorkspaceByNumber = async (workspaceNumber) => {
  const workspace = await Workspace.findOne({ workspace_number: workspaceNumber });
  return workspace;
};
  
module.exports = { findWorkspaceByNumber };
  