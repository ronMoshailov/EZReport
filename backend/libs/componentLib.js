const Component = require('../model/Component');

/**
 * Fetch all components from the database.
 * @returns {Promise<Array>} List of components or an error if the operation fails.
 */
const fetchAllComponents = async () => {
  try {
    const components = await Component.find(); // Fetch all components
    return components; // Return the components
  } catch (error) {
    console.error('Error fetching all components:', error.message);
    throw new Error('Failed to fetch components');
  }
};

/**
 * Fetch a single component by ID.
 * @param {String} id - The ID of the component to fetch.
 * @returns {Promise<Object>} The component data or an error if not found.
 */
const fetchComponentByID = async (id) => {
  try {
    console.log(`Fetching component with ID: ${id}`);
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

module.exports = {
  fetchAllComponents,
  fetchComponentByID,
};
