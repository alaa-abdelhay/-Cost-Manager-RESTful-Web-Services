'use strict';

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const express = require('express');
const mongoose = require('mongoose');
const logger = require('../utils/logger');
const userRoutes = require('../routes/users_routes');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({
        service: 'users',
        status: 'running'
    });
});

app.get('/health', (req, res) => {
    res.status(200).json({
        service: 'users',
        status: 'ok'
    });
});

app.use('/api', userRoutes);

const PORT = process.env.PORT || process.env.PORT_USERS || 4002;

async function startServer() {
    try {
        if (!process.env.MONGODB_URI) {
            logger.error('MONGODB_URI is missing');
        } else {
            await mongoose.connect(process.env.MONGODB_URI);
            logger.info('User Service connected to MongoDB Atlas');
        }
    } catch (error) {
        logger.error('MongoDB connection error:', error);
    }

    app.listen(PORT, () => {
        logger.info(`User Service is running on port ${PORT}`);
    });
}

startServer();