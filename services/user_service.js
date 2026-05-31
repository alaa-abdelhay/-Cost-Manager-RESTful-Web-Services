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

mongoose.connect(process.env.MONGODB_URI)
    .then(() => logger.info('User Service connected to MongoDB Atlas'))
    .catch((error) => logger.error('User Service MongoDB connection error:', error));

app.use(async (req, res, next) => {
    try {
        const logEntry = new Log({
            level: 'info',
            message: `User Service Access: ${req.method} ${req.originalUrl}`,
            method: req.method,
            url: req.originalUrl
        });

        await logEntry.save();
    } catch (error) {
        logger.error('User Service Logging failed', error);
    }

    next();
});

app.use('/api', userRoutes);

const PORT = process.env.PORT || process.env.PORT_USERS || 4002;

app.listen(PORT, () => {
    logger.info(`User Service is running on port ${PORT}`);
});