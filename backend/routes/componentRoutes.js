const express = require('express');
const router = express.Router();

const {
    getAllComponentsController, 
    addComponentController, 
    removeComponentController, 
    increaseStockBySerialNumberController, 
    increaseStockByIdController, 
    updateStockController
} = require('../controller/componentController');

router.get('/getAllComponents', getAllComponentsController);
router.post('/addComponent', addComponentController);
router.delete('/removeComponent/:serialNumber', removeComponentController);
router.patch('/increaseStockBySerialNumber/:serialNumber', increaseStockBySerialNumberController);
router.patch('/increaseStockById/:component_id', increaseStockByIdController);
router.patch('/updateStock/:serialNumber', updateStockController);

module.exports = router;
