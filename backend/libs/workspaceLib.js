const Workspace = require('../model/Workspace');

/**
 * Checks if a workspace exists by its number.
 * @param {Number} workspaceNumber - The workspace number to search for.
 * @returns {Object|null} - The workspace document if found, otherwise `null`.
 * @throws {Error} - If there is a database error.
 */
const findWorkspaceByNumber = async (workspaceNumber) => {
    if (isNaN(workspaceNumber)) throw new Error('Invalid workspace number.');
    return await Workspace.findOne({ workspace_number: workspaceNumber });
  };
  
  module.exports = { findWorkspaceByNumber };
  