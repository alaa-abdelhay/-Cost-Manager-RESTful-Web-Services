'use strict';

const User = require('../models/user');
const Cost = require('../models/cost');

/*
 * Fetch all users without internal Mongo fields.
 */

async function getAllUsers() {
    return User.find({}, { _id: 0 }).lean();
}

/*
 * Find a specific user by their numeric ID.
 */

async function getUserById(id) {
    return User.findOne({ id }, { _id: 0 }).lean();
}

/*
 * Calculate the total sum of costs for a specific user ID.
 */

async function getUserTotalCost(id) {
    const result = await Cost.aggregate([
        { $match: { userid: Number(id) } },
        { $group: { _id: '$userid', total: { $sum: '$sum' } } }
    ]);
    return result.length > 0 ? result[0].total : 0;
}

/*
 * Create and save a new user.
 */

async function addUser(payload) {
    return await User.create(payload);
}

module.exports = { getAllUsers, getUserById, getUserTotalCost, addUser };