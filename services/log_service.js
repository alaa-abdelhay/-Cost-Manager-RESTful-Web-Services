const path = require('path');
// Load environment variables from the .env file located in the parent directory
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const express = require('express');
const mongoose = require('mongoose');
const logger = require('../utils/logger'); // Centralized logger utility
const logRoutes = require('../routes/logs_routes'); // Log-related routes

const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

/*
 * MongoDB Connection
 * Connects to the database using the URI provided in the environment variables.
 */

mongoose.connect(process.env.MONGODB_URI)
    .then(() => logger.info('Log Service connected to MongoDB'))
    .catch(err => logger.error('MongoDB connection error:', err));

/*
 * Routes Configuration
 * Any request starting with /api/logs will be handled by logRoutes.
 */

app.use('/api/logs', logRoutes);

/*
 * Server Activation
 * Defines the port and starts listening for incoming connections.
 */

const PORT = process.env.PORT_LOGS || 1234;
app.listen(PORT, () => {
    logger.info(`Log Service is running on port ${PORT}`);
});