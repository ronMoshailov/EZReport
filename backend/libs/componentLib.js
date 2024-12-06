const Component = require('../model/Component');

const fetchAllComponents = async () => {
  try {
    const allComponents = await Component.find();
    return allComponents;

  } catch (error) {
    console.error('Error in fetchAllComponents:', error.message);
    throw new Error('Failed to fetch components');
  }
};

const fetchComponentByID = async (id) => {
  try {
    const componentData = await Component.findOne({ _id: id }).select('serialNumber name');

    if (!componentData) {
      console.error(`Error in fetchComponentByID: Component not found`);
      return null;
    }

    return componentData;

  } catch (error) {
    console.error('Error in fetchComponentByID:', error.message);
    throw new Error('Failed to fetch component');
  }
};

const addComponent = async (serialNumber, name, stock) => {
  try{

    const existingComponent = await Component.findOne({serialNumber});
    if (existingComponent)
      throw new Error("Component already exists");

    const component = new Component({serialNumber, name, stock});
    await component.save();
    return component;

  } catch(error){
    if (error.message === 'Component already exists') throw error;
      
    console.error('Error in addComponent: ', error.message);
    throw new Error('Failed to add new component')
  }
};

const removeComponent = async (serialNumber) =>{
  try{
    const result = await Component.findOneAndDelete({serialNumber});
    if (!result){
      console.error("Error in removeComponent: The component wasn't found");
      return null;
    }
    return true;
  } catch(error){
    console.log("Error in removeComponent: ", error.message);
    throw new Error("The removing component failed");
  }

};

const increaseStockBySerialNumber = async (serialNumber, amount) => {

  try{
    const updatedDocument = await Component.findOneAndUpdate(
      { serialNumber },
      { $inc: { stock: amount } },
      {new: true}
    ).select('stock');
    
    if(!updatedDocument){
      console.error("Error in increaseStockBySerialNumber: Component wasn't found");
      return null;
    }

    return updatedDocument.stock;

  } catch (error){
    console.error("Error in increaseStockBySerialNumber: ", error.message);
    throw new Error("Increase stock failed");
  }
};

const increaseStockById = async (component_id, amount, session) => {
  const updatedComponent = await Component.findByIdAndUpdate(
    component_id,
    { $inc: { stock: amount } },
    { new: true, session }
  ).select('stock');

    if (!updatedComponent) {
      console.error("Error in increaseStockById: Component wasn't found");
      return null;
    }

  return updatedComponent.stock;
};

const updateStock = async (serialNumber, stock) => {
  const component = await Component.findOneAndUpdate(
    { serialNumber },
    { stock },
    {new: true}
  ).select('stock');

  if (!component) {
    console.error("Error in updateStock: Component wasn't found");
    return null;
  }
  
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
