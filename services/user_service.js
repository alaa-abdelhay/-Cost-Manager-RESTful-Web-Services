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



const PORT = process.env.PORT || process.env.PORT_USERS || 4002;

app.listen(PORT, () => {
    logger.info(`User Service is running on port ${PORT}`);
});