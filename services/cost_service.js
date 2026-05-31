const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const express = require('express');
const mongoose = require('mongoose');
const logger = require('../utils/logger');
const costRoutes = require('../routes/costs_routes');
const Log = require('../models/log');

const app = express();
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => logger.info('Cost Service connected to MongoDB'))
    .catch(err => logger.error('MongoDB connection error:', err));

/*
 * Logging Middleware
 * Persists request metadata into the logs collection.
 */

app.use(async (req, res, next) => {
    try {
        const logEntry = new Log({
            level: 'info',
            message: `Cost Service Access: ${req.method} ${req.originalUrl}`,
            method: req.method,
            url: req.originalUrl
        });
        await logEntry.save();
    } catch (error) {
        logger.error('Cost Service Logging failed', error);
    }
    next();
});

app.use('/api', costRoutes);


const PORT = process.env.PORT || process.env.PORT_COSTS || 4003;
app.listen(PORT, () => {
    logger.info(`Cost Service is running on port ${PORT}`);
});