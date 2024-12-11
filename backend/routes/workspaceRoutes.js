const express = require('express');
const router = express.Router();
const { isWorkspaceExistController } = require('../controller/workspaceController');

router.get('/isWorkspaceExist/:workspaceNum', isWorkspaceExistController);

module.exports = router;
