const Component = require('../model/Component');

const fetchAllComponents = async () => {
  try {
    const components = await Component.find();
    return components;
  } catch (error) {
    console.error('Error fetching all components:', error.message);
    throw new Error('Failed to fetch components');
  }
};

const fetchComponentByID = async (id) => {
  try {
    const componentData = await Component.findOne({ _id: id }).select('serialNumber name');
    if (!componentData) {
      console.warn(`No component found with ID: ${id}`);
      throw new Error('Component not found');
    }
    return componentData;
  } catch (error) {
    console.error('Error fetching component by ID:', error.message);
    throw new Error(error.message);
  }
};

const addComponent = async (data) => {
  const {serialNumber, name, stock} = data;
  if(!serialNumber || !name || stock === undefined) throw new Error('Missing required fields: serialNumber, name, or stock'); 
  const component = new Component({serialNumber, name, stock});
  await component.save();
  return true;
};

const removeComponent = async (serialNumber) =>{
  if(!serialNumber) throw new Error('Serial number is required to remove a component');
  const result = await Component.findOneAndDelete({serialNumber});
  if (!result) throw new Error('Component not found');
  return result;
};

const increaseStock = async (serialNumber, amount) => {
  if (!serialNumber || amount === undefined || amount <= 0) throw new Error('Serial number and positive amount are required');
  const component = await Component.findOneAndUpdate(
    { serialNumber },
    { $inc: { stock: amount } },
  );
    if (!component) throw new Error('Component not found');
  return true;
};

const updateStock = async (serialNumber, stock) => {
  if (!serialNumber || stock === undefined || stock < 0) throw new Error('Serial number and non-negative stock value are required');
  const component = await Component.findOneAndUpdate(
    { serialNumber },
    { stock },
  );
  if (!component) throw new Error('Component not found');
  return true;
};

module.exports = {
  fetchAllComponents,
  fetchComponentByID,
  addComponent,
  removeComponent,
  increaseStock,
  updateStock,
};
