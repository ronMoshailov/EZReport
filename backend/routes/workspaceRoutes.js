
const express = require('express');
const router = express.Router();
const { sendWorkspace, isWorkspaceExist , receivedWorkspace} = require('../controller/workspaceController');

router.get('/isWorkspaceExist/:id', isWorkspaceExist);
router.post('/sendWorkspace', sendWorkspace);
router.post('/receivedWorkspace', receivedWorkspace);

module.exports = router;
