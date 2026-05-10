const mongoose = require('mongoose');

// Supported categories as per project requirements
const CATEGORY_VALUES = ['food', 'health', 'housing', 'sports', 'education'];

/**
 * Cost Schema
 * Defines the structure for expenses.
 * 'userid' is the numeric ID of the owner.
 */
const costSchema = new mongoose.Schema(
    {
        description: {
            type: String,
            required: [true, 'description is required'],
            trim: true,
        },
        category: {
            type: String,
            required: [true, 'category is required'],
            enum: CATEGORY_VALUES,
            lowercase: true,
            trim: true,
        },
        userid: {
            type: Number,
            required: [true, 'userid is required'],
            index: true,
        },
        sum: {
            type: Number,
            required: [true, 'sum is required'],
            min: [0, 'sum cannot be negative'],
        },
        date: {
            type: Date,
            required: true,
            default: Date.now,
            index: true,
        },
    },
    {
        collection: 'costs',
        versionKey: false,
    }
);

// Compound index for faster report generation
costSchema.index({ userid: 1, date: 1 });

const Cost = mongoose.model('Cost', costSchema);
module.exports = Cost;
module.exports.CATEGORY_VALUES = CATEGORY_VALUES;