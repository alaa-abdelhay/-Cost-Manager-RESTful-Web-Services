'use strict';

const mongoose = require('mongoose');

/*
 * User Schema
 * Defines the structure for users in the database.
 * Uses a numeric ID as required by the project specifications.
 */

const userSchema = new mongoose.Schema(
    {
        id: {
            type: Number,
            required: [true, 'id is required'],
            unique: true,
            min: [1, 'id must be a positive integer'],
            validate: {
                validator: Number.isInteger,
                message: 'id must be an integer'
            }
        },
        first_name: {
            type: String,
            required: [true, 'first_name is required'],
            trim: true,
            minlength: [1, 'first_name cannot be empty']
        },
        last_name: {
            type: String,
            required: [true, 'last_name is required'],
            trim: true,
            minlength: [1, 'last_name cannot be empty']
        },
        birthday: {
            type: Date,
            required: [true, 'birthday is required']
        }
    },
    { versionKey: false } // Removes the __v version field from the response
);

module.exports = mongoose.model('User', userSchema);