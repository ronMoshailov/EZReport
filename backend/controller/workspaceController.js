const { findWorkspaceByNumber } = require('../libs/workspaceLib');

// Getting information from DB
const isWorkspaceExistController = async (req, res) => {
  try {
    const { workspaceNum } = req.params;
    const workspace = await findWorkspaceByNumber(workspaceNum);

    if (!workspace){
      console.error("Error in isWorkspaceExist: workspace not found")
      return res.status(404).json({message: "Workspace not found"});
    } 

    return res.status(200).json({exist: true, workspace});

  } catch (error) {
    console.error('Error in isWorkspaceExist:', error.message);
    return res.status(500).json({ message: error.message });
  }
};

// Export the controller functions
module.exports = { isWorkspaceExistController };
