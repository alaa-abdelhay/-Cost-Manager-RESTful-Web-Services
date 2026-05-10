'use strict';

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const express = require('express');
const mongoose = require('mongoose');
const logger = require('../utils/logger');
const userRoutes = require('../routes/users_routes');
const Log = require('../models/log');

const app = express();
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => logger.info('User Service connected to MongoDB Atlas'))
    .catch(err => logger.error('MongoDB connection error:', err));

/*
 * Global Logging Middleware
 * Persists every incoming request into the MongoDB logs collection.
 */

app.use(async (req, res, next) => {
    try {
        const logEntry = new Log({
            level: 'info',
            message: `User Service Request: ${req.method} ${req.originalUrl}`,
            method: req.method,
            url: req.originalUrl
        });
        await logEntry.save();
    } catch (error) {
        logger.error('User Service Log persistence failed', error);
    }
    next();
});

// Use routes with the /api prefix
app.use('/api', userRoutes);

const PORT = process.env.PORT_USERS || 4002;
app.listen(PORT, () => {
    logger.info(`User Service is running on port ${PORT}`);
});