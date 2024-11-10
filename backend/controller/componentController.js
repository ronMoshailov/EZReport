const Component = require('../model/Component');


const getComponent = async (req, res) => {
    try {
      const components = await Component.find();
      res.status(200).json(components);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch components' });
    }
  }


  const getComponentByID = async (req, res) => {
    const { id } = req.params;
  
    try {
      console.log(`Fetching component with serialNumber: ${id}`);
      
      // Find component by `serialNumber`
      const componentData = await Component.findOne({ _id: id }).select('serialNumber name');
  
      if (!componentData) {
        console.warn(`No component found with serialNumber: ${id}`);
        return res.status(404).json({ message: 'Component not found' });
      }
  
      console.log(`Component name found: ${componentData}`);
      res.status(200).json(componentData);
  
    } catch (error) {
      console.error('Error checking component:', error.message);
      res.status(500).json({ message: 'Error checking component', error: error.message });
    }
  };
  

  const decreaseStock = async (req, res) => {
    const { components_list } = req.body; // Receive `component_list` in the request body

    if (!Array.isArray(components_list) || components_list.length === 0) {
      return res.status(400).json({ message: 'components_list must be a non-empty array' });
    }

    try {  
      // Loop through each component in the list
      for (const comp of components_list) {
        const { component, stock } = comp;

        // Find the component by its ID
        const foundComponent = await Component.findById(component);

        // Decrease the stock by `stock`
        foundComponent.stock = Math.max(0, foundComponent.stock - stock);

        // Save the updated component
        await foundComponent.save();
      }
  
    // Send the response back to the client with the results array
    res.status(200).json({ message: 'Stock updated for components' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating component count', error: error.message });
    }
  };
  
  const addBackToStock = async (req, res) => {
    const { component_id, stock } = req.body;
    try {
      const updatedComponent = await Component.findByIdAndUpdate(
        component_id,
        { $inc: { stock: stock } }, // Increment the stock by the provided amount
        { new: true } // Return the updated document
      );
  
      if (!updatedComponent) {
        return res.status(404).json({ message: 'Component not found.' });
      }
  
      res.status(200).json({ message: 'Stock updated successfully.', updatedComponent });
    } catch (error) {
      console.error('Error updating stock:', error.message);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };
  
  
  // const getAllComponent = async (req, res) => {
  //   try {
  //     const components = await Component.find();
  //     res.status(200).json(components);
  //   } catch (error) {
  //     res.status(500).json({ message: 'Failed to fetch components' });
  //   }
  // }

  module.exports = {getComponent, getComponentByID, decreaseStock, addBackToStock};
