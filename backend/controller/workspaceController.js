const { findWorkspaceByNumber } = require('../libs/workspaceLib');

// Check if the workspace exist
const isWorkspaceExistController = async (req, res) => {
  
  try {
    // Get data from the request
    const { workspaceNum } = req.params;

    // Check if the workspace exist
    const workspace = await findWorkspaceByNumber(workspaceNum);

    // Check if the workspace was found
    if (!workspace){
      console.error("Error in isWorkspaceExistController: workspace not found")
      return res.status(404).json({message: "Workspace not found"});
    } 

    // Respond with HTTP 200 (OK) to indicate the request was successful  
    return res.status(200).json({exist: true, workspace});

  } catch (error) {
    console.error('Error in isWorkspaceExistController:', error.message);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { isWorkspaceExistController };
