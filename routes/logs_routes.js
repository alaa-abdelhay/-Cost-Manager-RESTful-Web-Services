const express = require('express');
const router = express.Router();
const Log = require('../models/log');
const logger = require('../utils/logger');

/*
 * @route   GET /api/logs
 * @desc    Retrieve all logs from the database
 * @access  Public
 */

router.get('/', async (req, res) => {
    try {
        // Fetch all logs and sort them by time in descending order (newest first)
        const logs = await Log.find({}).sort({ time: -1 });

        // Respond with the list of logs and a 200 OK status
        res.status(200).json(logs);
    } catch (error) {
        // Log the error internally for debugging
        logger.error('Error fetching logs:', error);

        // Respond with a 500 Internal Server Error status and a unique error ID
        res.status(500).json({
            id: Date.now(),
            message: 'Error retrieving logs from the database'
        });
    }
});

/*
 * @route   POST /api/logs
 * @desc    Receive and save a log entry from a remote microservice
 * @access  Internal/Public
 */

router.post('/', async (req, res) => {
    try {
        // Destructure log data from the request body
        const { level, message, method, url } = req.body;

        // Create a new log document using the Log model
        const newLog = new Log({
            level: level || 'info',       // Default to 'info' if level is not provided
            message: message || 'Remote Log',
            method: method || 'N/A',
            url: url || 'N/A'
        });

        // Save the log entry to MongoDB
        await newLog.save();

        // Respond with the saved log and a 201 Created status
        res.status(201).json(newLog);
    } catch (error) {
        // Log the error internally
        logger.error('Error saving remote log:', error);

        // Respond with a 500 Internal Server Error status
        res.status(500).json({
            id: Date.now(),
            message: 'Error saving remote log to the database'
        });
    }
});

// Export the router to be used in log_service.js
module.exports = router;