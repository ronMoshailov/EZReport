// controller/homeController.js
const path = require('path');

// Controller for serving the home page
exports.getHomePage = (req, res) => {
    res.sendFile(path.join(__dirname, '../CRM/index.html'));  // Adjust the path to the HTML file
};
