const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const connectToDB = require('./controller/connectToDB');
const { getHomePage } = require('./controller/home');
const Position = require('./model/position');
const reportsRouter = require('./routes/report'); // Assuming this is the path to the route file
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware to parse JSON bodies
// express.json() ->  built-in middleware function in Express that parses incoming requests with JSON payloads and makes the parsed data available under the req.body property.
app.use(express.json());

// Manually set CORS headers to allow all origins
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Allow all origins
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allowed HTTP methods
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allowed headers
  next(); // Pass to the next middleware/route handler
});

// Connect to the database
connectToDB();

// Example route
app.get('/api/check-employee-number/:number', async (req, res) => {
  const positionNumber = parseInt(req.params.number, 10);
  
  try {
      // Query MongoDB to check if the position number exists
      const position = await Position.findOne({ position: positionNumber });
      console.log('returned from DB: ' + position);
      if (position) {
          // If the position is found
          return res.status(200).json({ exists: true, position });
      } else {
          // If the position is not found
          return res.status(200).json({ exists: false });
      }
  } catch (error) {
      console.error('Error querying MongoDB:', error);
      return res.status(500).json({ error: 'Internal server error' });
  }
});

app.use('/api', reportsRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});