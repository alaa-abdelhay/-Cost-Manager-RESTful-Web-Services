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
 * Converts grouped costs object into the exact report structure
 * required by the project instructions.
 */
function buildCostsArray(groupedCosts) {
    return [
        { food: groupedCosts.food || [] },
        { education: groupedCosts.education || [] },
        { health: groupedCosts.health || [] },
        { housing: groupedCosts.housing || [] },
        { sports: groupedCosts.sports || [] }
    ];
}

/**
 * Logic to add a cost item.
 */
async function addCostItem(payload) {
    const { description, category, userid, sum, date } = payload;

    await assertUserExists(Number(userid));

    const costDate = date ? new Date(date) : new Date();

    if (Number.isNaN(costDate.getTime())) {
        const error = new Error('Invalid date');
        error.status = 400;
        throw error;
    }

    // Prevent adding cost items with dates that belong to the past.
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const costDay = new Date(costDate);
    costDay.setHours(0, 0, 0, 0);

    if (costDay < today) {
        const error = new Error('Cannot add cost items with past dates');
        error.status = 400;
        throw error;
    }

    return await Cost.create({
        description,
        category,
        userid: Number(userid),
        sum: Number(sum),
        date: costDate
    });
}

/**
 * Logic for monthly reports with caching.
 *
 * This function implements the Computed Design Pattern:
 * when a report belongs to a month that already passed,
 * the computed report is saved in MongoDB and reused later.
 */
async function getMonthlyReport(userid, year, month) {
    const reportsCollection = mongoose.connection.collection('monthly_reports');

    const numericUserId = Number(userid);
    const numericYear = Number(year);
    const numericMonth = Number(month);

    // Try to find a pre-computed report.
    const cached = await reportsCollection.findOne({
        userid: numericUserId,
        year: numericYear,
        month: numericMonth
    });

    if (cached) {
        return {
            userid: cached.userid,
            year: cached.year,
            month: cached.month,
            costs: Array.isArray(cached.costs)
                ? cached.costs
                : buildCostsArray(cached.costs || {})
        };
    }

    // Otherwise, compute the report from the costs collection.
    const startDate = new Date(numericYear, numericMonth - 1, 1);
    const endDate = new Date(numericYear, numericMonth, 0, 23, 59, 59);

    const costs = await Cost.find({
        userid: numericUserId,
        date: {
            $gte: startDate,
            $lte: endDate
        }
    });

    const groupedCosts = {};

    Cost.CATEGORY_VALUES.forEach((category) => {
        groupedCosts[category] = [];
    });

    costs.forEach((cost) => {
        if (groupedCosts[cost.category]) {
            groupedCosts[cost.category].push({
                sum: cost.sum,
                description: cost.description,
                day: cost.date.getDate()
            });
        }
    });

    const report = {
        userid: numericUserId,
        year: numericYear,
        month: numericMonth,
        costs: buildCostsArray(groupedCosts)
    };

    // Cache the report only if the month has already passed.
    const now = new Date();

    if (
        numericYear < now.getFullYear()
        || (numericYear === now.getFullYear() && numericMonth < now.getMonth() + 1)
    ) {
        await reportsCollection.insertOne({
            ...report,
            created_at: new Date()
        });
    }

    return report;
}

module.exports = {
    addCostItem,
    getMonthlyReport
};