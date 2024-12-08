const express = require('express');
const router = express.Router();
const { isWorkspaceExist } = require('../controller/workspaceController');

router.get('/isWorkspaceExist/:workspaceNum', isWorkspaceExist);

module.exports = router;
