const { fetchAllComponents, fetchComponentByID, addComponent, removeComponent, increaseStockBySerialNumber, increaseStockById, updateStock } = require('../libs/componentLib');

/**
 * Controller to handle fetching all components.
 * Sends the data as a JSON response.
 */
const getAllComponentsHandler = async (req, res) => {
  try {
    const components = await fetchAllComponents(); // Use the lib to fetch all components
    return res.status(200).json(components);
  } catch (error) {
    console.error('Error in getAllComponentsHandler:', error.message);
    return es.status(500).json({ message: error.message });
  }
};

/**
 * Controller to handle fetching a component by ID.2
 * Sends the data as a JSON response.
 */
const getComponentByIDHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if(!id){
      console.error("Error in getComponentByIDHandler: The id is null");
      return res.status(400).json({message: "Invalid parameters"})
    }

    const componentData = await fetchComponentByID(id);
    if(!componentData){
      console.error("Error in getComponentByIDHandler: Component not found");
      return res.status(404).json({message: "Component not found"})
    }
    return res.status(200).json(componentData);

  } catch (error) {
    console.error('Error in getComponentByIDHandler:', error.message);
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Add a new component
 */
const addComponentHandler = async (req, res) => {
  try {
    const {serialNumber, name, stock} = req.body;
    if(isNaN(serialNumber) || !name || isNaN(Number(stock))){
      if(isNaN(Number(serialNumber))) console.error("Error in addComponentHandler: serialNumber are invalid");
      if(!name) console.error("Error in addComponentHandler: name are null");
      if(isNaN(stock)) console.error("Error in addComponentHandler: the stock number is invalid");
      return res.status(400).json({message: "Missing required fields: serialNumber, name, or stock"});
    } 

    const newComponent = await addComponent(serialNumber, name, stock);
    return res.status(201).json({message: "New component created successfully", component: newComponent});
  } catch (error) {
    if (error.message === 'Component already exists') {
      console.error('Error in addComponentHandler:', error.message);
      return res.status(409).json({message: error.message})
    }
    console.error('Error in addComponentHandler:', error.message);
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Remove a component by serial number
 */
const removeComponentHandler = async (req, res) => {
  try {
    const serialNumber = Number(req.params.serialNumber);
    if(isNaN(serialNumber)){
      console.error("Error in removeComponentHandler: serialNumber is null");
      return res.status(400).json({message: "Invalid parameter"});
    }
    const result = await removeComponent(serialNumber);
    if(!result){
      console.error("Error in removeComponentHandler: Component wasn't found");
      return res.status(404).json({message: "Component not found"})
    }
    return res.status(200).json({message: "Component removed successfully"});
  } catch (error) {
    console.error('Error in removeComponentHandler:', error.message);
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Increase the stock of a component
 */
const increaseStockBySerialNumberHandler = async (req, res) => {
  try {
    const serialNumber = Number(req.params.serialNumber);
    const { amount } = req.body;
    if (isNaN(serialNumber) || isNaN(Number(amount)) || amount <= 0 || amount === undefined){
      if(isNaN(serialNumber)) console.error('Error in increaseStockBySerialNumberHandler: Serial number is invalid');
      if(isNaN(amount)) console.error('Error in increaseStockBySerialNumberHandler: amount is invalid');
      if(amount <= 0) console.error('Error in increaseStockBySerialNumberHandler: amount is equal or less than zero');
      if(amount === undefined) console.error('Error in increaseStockBySerialNumberHandler: amount is undefined');
      return res.status(400).json({message: "Invalid parameters"});
    } 
  
    const updatedStock = await increaseStockBySerialNumber(serialNumber, amount);
    if(!updatedStock){
      console.error("Error in increaseStockBySerialNumberHandler: Component not found");
      return res.status(404).json({message: "Component not found"});
    }

    return res.status(200).json({message: "The component updated successfully", stock: updatedStock});

  } catch (error) {
    console.error('Error in increaseStockHandler:', error.message);
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Increase the stock of a component
 */
const increaseStockByIdHandler = async (req, res) => {
  try {
    const component_id = req.params.component_id;
    const { amount } = req.body;
    if(!component_id || isNaN(Number(amount)) || amount <= 0 || amount === undefined) {
      if(!component_id) console.error("Error in increaseStockByIdHandler: The component id is missing");
      if(isNaN(amount)) console.error("Error in increaseStockByIdHandler: The amount is invalid");
      if(amount <= 0) console.error("Error in increaseStockByIdHandler: The amount is less or equal to zero");
      if(amount === undefined) console.error("Error in increaseStockByIdHandler: The amount undefined");
      return res.status(400).json({message: "Invalid parameters"});
    }

    const updatedStock = await increaseStockById(component_id, amount);

    if(!updatedStock){
      console.error("Error in increaseStockByIdHandler: Component not found");
      return res.status(404).json({message: "Component not found"});
    }

    res.status(200).json({message: "Component updated successfully", stock: updatedStock});
  } catch (error) {
    console.error('Error in increaseStockHandler:', error.message);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Update the stock of a component
 */
const updateStockHandler = async (req, res) => {
  try {
    const serialNumber = Number(req.params.serialNumber);
    const { stock } = req.body;

    if(isNaN(serialNumber) || isNaN(Number(stock)) || stock < 0 || stock === undefined){
      if(isNaN(serialNumber)) console.error("Error in updateStockHandler: The serialNumber is invalid");
      if(isNaN(Number(stock))) console.error("Error in updateStockHandler: The stock is invalid");
      if(stock < 0) console.error("Error in updateStockHandler: The stock is less than zero");
      if(stock === undefined) console.error("Error in updateStockHandler: The stock undefined");
      return res.status(400).json({message: "Invalid parameters"});
    }

    const updatedStock = await updateStock(serialNumber, stock);

    if(!updatedStock){
      console.error("The component wasn't found");
      return res.status(404).json({message: "Component not found"});
    }

    return res.status(200).json({message: "The component updated successfully", stock: updatedStock});

  } catch (error) {
    console.error('Error in updateStockHandler:', error.message);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllComponentsHandler,
  getComponentByIDHandler,
  addComponentHandler,
  removeComponentHandler,
  increaseStockBySerialNumberHandler,
  increaseStockByIdHandler,
  updateStockHandler,
};
