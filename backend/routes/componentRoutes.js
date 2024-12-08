const express = require('express');
const router = express.Router();
const {getAllComponentsHandler, getComponentByIDHandler, addComponentHandler, removeComponentHandler, increaseStockBySerialNumberHandler, increaseStockByIdHandler, updateStockHandler} = require('../controller/componentController');

router.get('/getAllComponents', getAllComponentsHandler);
router.get('/getComponentByID/:id', getComponentByIDHandler);
router.post('/addComponent', addComponentHandler);
router.delete('/removeComponent/:serialNumber', removeComponentHandler);
router.patch('/increaseStockBySerialNumber/:serialNumber', increaseStockBySerialNumberHandler);
router.patch('/increaseStockById/:component_id', increaseStockByIdHandler);
router.patch('/updateStock/:serialNumber', updateStockHandler);

module.exports = router;
