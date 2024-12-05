const { fetchAllComponents, fetchComponentByID, addComponent, removeComponent, increaseStock, updateStock } = require('../libs/componentLib');

/**
 * Controller to handle fetching all components.
 * Sends the data as a JSON response.
 */
const getAllComponentsHandler = async (req, res) => {
  try {
    const components = await fetchAllComponents(); // Use the lib to fetch all components
    res.status(200).json(components);
  } catch (error) {
    console.error('Error in getAllComponent:', error.message);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Controller to handle fetching a component by ID.2
 * Sends the data as a JSON response.
 */
const getComponentByIDHandler = async (req, res) => {
  const { id } = req.params; // Extract ID from the request parameters
  try {
    const componentData = await fetchComponentByID(id); // Use the lib to fetch the component by ID
    res.status(200).json(componentData);
  } catch (error) {
    console.error('Error in getComponentByID:', error.message);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Add a new component
 */
const addComponentHandler = async (req, res) => {
  try {
    await addComponent(req.body);
    res.status(201).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Remove a component by serial number
 */
const removeComponentHandler = async (req, res) => {
  try {
    const serialNumber = parseInt(req.params.serialNumber);
    await removeComponent(serialNumber);
    res.status(200).send();
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

/**
 * Increase the stock of a component
 */
const increaseStockHandler = async (req, res) => {
  try {
    const serialNumber = parseInt(req.params.serialNumber);
    const { amount } = req.body;
    await increaseStock(serialNumber, amount);
    res.status(200).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Update the stock of a component
 */
const updateStockHandler = async (req, res) => {
  try {
    const serialNumber = parseInt(req.params.serialNumber);
    const { stock } = req.body;
    const updatedComponent = await updateStock(serialNumber, stock);
    res.status(200).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getAllComponentsHandler,
  getComponentByIDHandler,
  addComponentHandler,
  removeComponentHandler,
  increaseStockHandler,
  updateStockHandler,
};
