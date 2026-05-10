'use strict';

const mongoose = require('mongoose');
const Cost = require('../models/cost');
const User = require('../models/user');

/**
 * Ensures the user exists before allowing a cost to be added.
 */
async function assertUserExists(userid) {
    const user = await User.findOne({ id: userid });
    if (!user) {
        const error = new Error('User not found');
        error.status = 404;
        throw error;
    }
}

/**
 * Logic to add a cost item.
 */
async function addCostItem(payload) {
    const { description, category, userid, sum, date } = payload;

    await assertUserExists(Number(userid));

    return await Cost.create({
        description,
        category,
        userid: Number(userid),
        sum: Number(sum),
        date: date ? new Date(date) : new Date()
    });
}

/**
 * Logic for monthly reports with caching (Computed Pattern).
 */
async function getMonthlyReport(userid, year, month) {
    const reportsCollection = mongoose.connection.collection('monthly_reports');

    // Try to find a pre-computed report
    const cached = await reportsCollection.findOne({ userid: Number(userid), year: Number(year), month: Number(month) });
    if (cached) return cached;

    // Otherwise, compute the report
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const costs = await Cost.find({
        userid: Number(userid),
        date: { $gte: startDate, $lte: endDate }
    });

    const groupedCosts = {};
    Cost.CATEGORY_VALUES.forEach(cat => groupedCosts[cat] = []);

    costs.forEach(cost => {
        if (groupedCosts[cost.category]) {
            groupedCosts[cost.category].push({
                day: cost.date.getDate(),
                description: cost.description,
                sum: cost.sum
            });
        }
    });

    const report = { userid: Number(userid), year: Number(year), month: Number(month), costs: groupedCosts };

    // Cache the report if the month has already passed
    const now = new Date();
    if (year < now.getFullYear() || (year == now.getFullYear() && month < now.getMonth() + 1)) {
        await reportsCollection.insertOne({ ...report, created_at: new Date() });
    }

    return report;
}

module.exports = { addCostItem, getMonthlyReport };