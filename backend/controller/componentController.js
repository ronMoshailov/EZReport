const { fetchAllComponents, fetchComponentByID } = require('../libs/componentLib');

/**
 * Controller to handle fetching all components.
 * Sends the data as a JSON response.
 */
const getAllComponent = async (req, res) => {
  try {
    const components = await fetchAllComponents(); // Use the lib to fetch all components
    res.status(200).json(components);
  } catch (error) {
    console.error('Error in getAllComponent:', error.message);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Controller to handle fetching a component by ID.
 * Sends the data as a JSON response.
 */
const getComponentByID = async (req, res) => {
  const { id } = req.params; // Extract ID from the request parameters

  try {
    const componentData = await fetchComponentByID(id); // Use the lib to fetch the component by ID
    res.status(200).json(componentData);
  } catch (error) {
    console.error('Error in getComponentByID:', error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllComponent,
  getComponentByID,
};
