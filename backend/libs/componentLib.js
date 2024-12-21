const Component = require('../model/Component');

// fetch all components from the DB (called by controller)
const fetchAllComponents = async () => {

  try {
    const allComponents = await Component.find();                     // Get all components from DB
    return allComponents;                                             // Return the components

  } catch (error) {
    console.error('Error in fetchAllComponents:', error.message);     // Log the error
    throw new Error('Failed to fetch all components');                // Throw the error to the controller
  }
};

// Get the component serial number and name (used by fetchComponentByID of reportLib.js)
const fetchComponentByID = async (id) => {

  try {
    const componentData = await Component.findOne({ _id: id }).select('serialNumber name');
    return componentData;

  } catch (error) {
    console.error('Error in fetchComponentByID:', error.message);
    throw new Error('Failed to fetch component');
  }
};

// Change information in DB (called by controller)
const addComponent = async (serialNumber, name, stock) => {

  try{
    const existingComponent = await Component.findOne({serialNumber});    // Try to find the component with the same serial number in the DB
    if (existingComponent)                                                // If the component found
      return { conflict: true, component: existingComponent };            // Return the existing component to indicate a conflict

    const newComponent = new Component({serialNumber, name, stock});      // Try to add create new component
    await newComponent.save();                                            // Save the component in DB
    return { conflict: false, component: newComponent };                  // No conflict, return the newly created component

  } catch(error){
    console.error('Error in addComponent: ', error.message);              // Log the error
    throw new Error('Failed to add new component');                       // Throw the error to the controller
  }
};




// Remove component from DB (called by controller)
const removeComponent = async (serialNumber) =>{

  try{
    const result = await Component.findOneAndDelete({serialNumber});      // Remove the component from the DB
    return result;                                                        // return the result
  } catch(error){
    console.error("Error in removeComponent: ", error.message);           // Log the error
    throw new Error("Failed to remove component");                        // Throw the error to the controller
  }

};




// Increase the stock of a component by serial number (called by controller)
const increaseStockBySerialNumber = async (serialNumber, amount) => {

  try{
    // Update the stock of the component
    const updatedDocument = await Component.findOneAndUpdate(
      { serialNumber },
      { $inc: { stock: amount } },
      {new: true}
    ).select('stock');
    
    return updatedDocument;

  } catch (error){
    console.error("Error in increaseStockBySerialNumber: ", error.message);   // Log the error
    throw new Error("Increase stock failed");                                 // Throw the error to the controller
  }
};

// Increase the stock of a component by ID (called by controller)
const increaseStockById = async (component_id, amount, session) => {
  try{
  const updatedComponent = await Component.findByIdAndUpdate(
    component_id,
    { $inc: { stock: amount } },
    { new: true, session }
  ).select('stock');

  // Return the updated component
  return updatedComponent;

  } catch(error){
    console.error("Error in increaseStockById:", error.message);
    throw new Error("Increasing stock failed");
  }
};

// Update the stock (called by controller)
const updateStock = async (serialNumber, stock) => {
  const component = await Component.findOneAndUpdate(
    { serialNumber },
    { stock },
    {new: true}
  ).select('stock');

  return component.stock;
};

module.exports = {
  fetchAllComponents,
  fetchComponentByID,
  addComponent,
  removeComponent,
  increaseStockBySerialNumber,
  increaseStockById,
  updateStock,
};
