const { fetchAllComponents, addComponent, removeComponent, increaseStockBySerialNumber, increaseStockById, updateStock } = require('../libs/componentLib');

// Getting information from DB
const getAllComponentsController = async (req, res) => {
  try {
    const components = await fetchAllComponents();                                          // Fetch all the components from the DB
    
    if(!components || components.length === 0)                                              // Check if the result is valid
      return res.status(404).json({message: 'Components not found'});                       // Respond with HTTP 404 (Not Found) to indicate the requested resource was not found
    
      return res.status(200).json({components: components, message: 'Components found'});     // Respond with HTTP 200 (OK) to indicate the request was successful

    } catch (error) {
    console.error('Error in getAllComponentsHandler:', error.message);                      // Log the error
    return res.status(500).json({ message: error.message });                                // Respond with HTTP 500 (Internal Server Error) and an error message 
  }
};

// Adding new component
const addComponentController = async (req, res) => {
  try {
    const {serialNumber, name, stock} = req.body;                                                           // Get data from the request

    if(!serialNumber || !name || isNaN(Number(stock)) || stock <= 0){                                       // Check if the any data is not valid
      if(!serialNumber)                                                                                     // Check if the serialNumber is undefined
        console.error("Error in addComponentHandler: serialNumber are invalid");                            // Log the error
      if(!name)                                                                                             // Check if the name is undefined
        console.error("Error in addComponentHandler: name are null");                                       // Log the error
      if(isNaN(Number(stock)))                                                                              // Check if the stock is invalid
        console.error("Error in addComponentHandler: the stock number is invalid");                         // Log the error
      if(stock <= 0)                                                                                        // Check if the stock less or equal than 0
        console.error("Error in addComponentHandler: the stock is zero or negative");                       // Log the error
      return res.status(400).json({message: 'Invalid parameters was sent'});                                // Respond with HTTP 400 (Bad Request) to indicate the request was invalid
    } 

    const { conflict, newComponent } = await addComponent(serialNumber, name, stock);

    if (conflict){                                                                                          // Check if was a conflict
      console.error('Error in addComponentController: Component already exist');                            // Log the error
      return res.status(409).json({message: 'Component already exist'});                                    // Respond with HTTP 409 (Conflict) to indicate that the request could not be processed due to a conflict with the current resource
    }

    return res.status(201).json({message: "New component created successfully", component: newComponent});  // Respond with HTTP 201 (Created) to indicate the resource was successfully created
    
  } catch (error) {  
    console.error('Error in addComponentHandler:', error.message);                            // Log the error
    return res.status(500).json({ message: error.message });                                  // Respond with HTTP 500 (Internal Server Error) and an error message
  }
};

// Remove a component by serial number
const removeComponentController = async (req, res) => {
  try {
    const serialNumber = Number(req.params.serialNumber);                           // Get data from the request

    if(!serialNumber){                                                              // Check if the serialNumber is undefined 
      console.error("Error in removeComponentHandler: serialNumber is undefined");  // Log the error
      return res.status(400).json({message: "Invalid parameter"});                  // Respond with HTTP 400 (Bad Request) to indicate the request was invalid
    }

    const result = await removeComponent(serialNumber);                             // Try remove the component
    
    if(!result){
      console.error("Error in removeComponentController: Component not found");     // Log the error
      return res.status(404).json({message: "Component not found"});                // Respond with HTTP 404 (Not Found) to indicate the requested resource was not found
    }

    return res.status(200).json({message: "Component removed successfully"});       // Respond with HTTP 200 (OK) to indicate the request was successful  

  } catch (error) {
    console.error('Error in removeComponentHandler:', error.message);               // Log the error
    return res.status(500).json({ message: error.message });                        // Respond with HTTP 500 (Internal Server Error) and an error message
  }
};

// Increase the stock of a component by serial number
const increaseStockBySerialNumberController = async (req, res) => {
  try {

    // Get data from the request
    const serialNumber = req.params.serialNumber;
    const { amount } = req.body;

    // Check if the data is valid
    if (!serialNumber || isNaN(Number(amount)) || amount <= 0 || amount === undefined){
      if(!serialNumber) 
        console.error('Error in increaseStockBySerialNumberController: Serial number is invalid');
      if(isNaN(amount)) 
        console.error('Error in increaseStockBySerialNumberController: amount is not a number');
      if(amount <= 0) 
        console.error('Error in increaseStockBySerialNumberController: amount is equal or less than zero');
      if(amount === undefined) 
        console.error('Error in increaseStockBySerialNumberController: amount is undefined');
      return res.status(400).json({message: "Invalid parameters"});
    } 
    
    // Increase the stock
    const updatedComponent = await increaseStockBySerialNumber(serialNumber, amount);

    // Check if the component updated
    if(!updatedComponent){
      console.error("Error in increaseStockBySerialNumberController: Component not found");
      return res.status(404).json({message: "Component not found"});
    }

    // Respond with HTTP 200 (OK) to indicate the request was successful  
    return res.status(200).json({message: "The component updated successfully", stock: updatedComponent.stock});

  } catch (error) {
    console.error('Error in increaseStockBySerialNumberController:', error.message);
    return res.status(500).json({ message: error.message });
  }
};

// Increase the stock of a component
const increaseStockByIdController = async (req, res) => {
  try {

    // Get data from the request
    const component_id = req.params.component_id;
    const { amount } = req.body;
    
    // Check if the data is valid
    if(!component_id || isNaN(Number(amount)) || amount <= 0 || amount === undefined) {
      if(!component_id) 
        console.error("Error in increaseStockByIdHandler: The component id is missing");
      if(isNaN(amount)) 
        console.error("Error in increaseStockByIdHandler: The amount is invalid");
      if(amount <= 0) 
        console.error("Error in increaseStockByIdHandler: The amount is less or equal to zero");
      if(amount === undefined) 
        console.error("Error in increaseStockByIdHandler: The amount undefined");
      return res.status(400).json({message: "Invalid parameters"});
    }
    
    // Update the stock
    const updatedComponent = await increaseStockById(component_id, amount);

    // Check if the component was found
    if(!updatedComponent){
      console.error("Error in increaseStockByIdHandler: Component not found");
      return res.status(404).json({message: "Component not found"});
    }

    // Respond with HTTP 200 (OK) to indicate the request was successful
    return res.status(200).json({message: "Component updated successfully", stock: updatedComponent.stock});

  } catch (error) {
    console.error('Error in increaseStockHandler:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// Update the stock of a component
const updateStockController = async (req, res) => {
  try {

    // Get data from the request
    const serialNumber = Number(req.params.serialNumber);
    const { stock } = req.body;

    // Check if the data is valid
    if(!serialNumber || isNaN(Number(stock)) || stock < 0 || stock === undefined){
      if(!serialNumber) 
        console.error("Error in updateStockController: The serialNumber is invalid");
      if(isNaN(Number(stock))) 
        console.error("Error in updateStockController: The stock is invalid");
      if(stock < 0) 
        console.error("Error in updateStockController: The stock is negative");
      if(stock === undefined) 
        console.error("Error in updateStockController: The stock undefined");
      return res.status(400).json({message: "Invalid parameters"});
    }

    // Update the stock
    const updatedStock = await updateStock(serialNumber, stock);

    // Check if the component was found
    if(!updatedStock){
      console.error("Component Not found");
      return res.status(404).json({message: "Component not found"});
    }

    // Respond with HTTP 200 (OK) to indicate the request was successful
    return res.status(200).json({message: "The component updated successfully", stock: updatedStock});

  } catch (error) {
    console.error('Error in updateStockHandler:', error.message);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllComponentsController,
  addComponentController,
  removeComponentController,
  increaseStockBySerialNumberController,
  increaseStockByIdController,
  updateStockController,
};
