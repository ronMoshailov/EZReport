const express = require('express');

// Require routes
const reportsRouter = require('./routes/reportRoutess'); // Assuming this is the path to the route file
const EmployeeRoutes = require('./routes/employeeRoutes'); // Assuming this is the path to the route file
const positionRoutes = require('./routes/workspaceRoutes');
const componentRoutes = require('./routes/componentRoutes');
const ReportProductionRoute = require('./routes/reportingProductionRoute');
const reportStorageRoutes = require('./routes/reportingStorageRoute');

// Require methods
const connectToDB = require('./connectToDB');

// Defines
require('dotenv').config();
const PORT = process.env.PORT || 4000;
const app = express();

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


app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('Malformed JSON:', err.message);
    return res.status(400).json({ message: 'Malformed JSON in request body' });
  }
  next(err); // Pass other errors to the default error handler
});

app.use('/api', reportsRouter);
app.use('/api', EmployeeRoutes);
app.use('/api', positionRoutes);
app.use('/api', componentRoutes);
app.use('/api', ReportProductionRoute);
app.use('/api', reportStorageRoutes);

// Connect to the database
connectToDB();

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});