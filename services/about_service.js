'use strict';

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const express = require('express');
const mongoose = require('mongoose');
const logger = require('../utils/logger');
const aboutRoutes = require('../routes/about_routes');
const Log = require('../models/log');

const app = express();

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
    .then(() => logger.info('About Service connected to MongoDB Atlas'))
    .catch((error) => logger.error('About Service MongoDB connection error:', error));

app.use(async (req, res, next) => {
    try {
        const logEntry = new Log({
            level: 'info',
            message: `About Service Access: ${req.method} ${req.originalUrl}`,
            method: req.method,
            url: req.originalUrl
        });

        await logEntry.save();
    } catch (error) {
        logger.error('About Service Logging failed', error);
    }

    next();
});

app.use('/', aboutRoutes);

const PORT = process.env.PORT || process.env.ABOUT_SERVICE_PORT || 4004;

app.listen(PORT, () => {
    logger.info(`About Service is running on port ${PORT}`);
});