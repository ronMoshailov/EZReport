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
      const component = await Component.findOne({ component_num: id });
      if (component) {
        console.log(`component name: ${component.component_name}`);
        res.status(200).json(component);
      } else {
        res.status(404).json({ message: 'Component not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error checking component' });
    }
  }


  module.exports = {getComponent, getComponentByID};
