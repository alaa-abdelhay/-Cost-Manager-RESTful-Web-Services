const mongoose = require('mongoose');

// Define the schema for the Log collection
const logSchema = new mongoose.Schema({
    // The severity level of the log (e.g., info, error, warn)
    level: {
        type: String,
        default: 'info'
    },
    // The descriptive message of the log entry
    message: {
        type: String,
        required: true
    },
    // The HTTP method used (GET, POST, etc.)
    method: {
        type: String
    },
    // The specific URL path accessed
    url: {
        type: String
    },
    // The exact timestamp of the log entry
    time: {
        type: Date,
        default: Date.now
    }
});

/*
 * Log Model
 * This model will be used to create and query logs in the 'logs' collection.
 */

const Log = mongoose.model('Log', logSchema);

module.exports = Log;