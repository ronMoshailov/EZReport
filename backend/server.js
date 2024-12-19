const express = require('express');
const http = require('http'); // Required to create the HTTP server
const { Server } = require('socket.io'); // Import Socket.IO
const mongoose = require('mongoose'); // For MongoDB Change Streams

// Require routes
const reportsRouter = require('./routes/reportRoutess'); // Assuming this is the path to the route file
const EmployeeRoutes = require('./routes/employeeRoutes'); // Assuming this is the path to the route file
const componentRoutes = require('./routes/componentRoutes');
const workspaceRoutes = require('./routes/workspaceRoutes');

// Require methods
const connectToDB = require('./connectToDB');

// Defines
require('dotenv').config();
const PORT = process.env.PORT || 4000;
const app = express();

// Wrap Express app with HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins (replace with specific frontend URL in production)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// Middleware to parse JSON bodies
// express.json() ->  built-in middleware function in Express that parses incoming requests with JSON payloads and makes the parsed data available under the req.body property.
app.use(express.json());

// Manually set CORS headers to allow all origins
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Allow all origins
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS'); // Allowed HTTP methods
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
app.use('/api', componentRoutes);
app.use('/api', workspaceRoutes);

// Connect to the database
connectToDB();

// Listen for MongoDB changes and emit them to connected clients
const setupChangeStreams = () => {
  const db = mongoose.connection;

  db.once('open', () => {
    console.log('MongoDB connected. Listening for changes...');

    // Watch the "reports" collection for changes
    const reportsChangeStream = db.collection('reports').watch();

    reportsChangeStream.on('change', (change) => {
      console.log('Change detected in reports:', change);

      // Check if it's an update operation and if 'status' was changed
      if (
        change.operationType === 'update' &&
        change.updateDescription &&
        change.updateDescription.updatedFields &&
        'status' in change.updateDescription.updatedFields
      ) {
        const updatedStatus = change.updateDescription.updatedFields.status;

        console.log(`Status field changed to: ${updatedStatus}`);

        // Broadcast the specific change to all connected clients
        io.emit('reportStatusUpdated', {
          documentKey: change.documentKey, // The document ID
          updatedStatus,                  // The new 'status' value
        });
      }
    });
  });
};

setupChangeStreams();

// Handle WebSocket connections
io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});