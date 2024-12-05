const express = require('express');
const router = express.Router();
const {getAllComponentsHandler, getComponentByIDHandler, addComponentHandler, removeComponentHandler, increaseStockHandler, updateStockHandler} = require('../controller/componentController');

router.get('/getAllComponents', getAllComponentsHandler);
router.get('/getComponentByID/:id', getComponentByIDHandler);
router.post('/addComponent', addComponentHandler);
router.delete('/removeComponent/:serialNumber', removeComponentHandler);
router.patch('/increaseStock/:serialNumber', increaseStockHandler);
router.patch('/updateStock/:serialNumber', updateStockHandler);

module.exports = router;
