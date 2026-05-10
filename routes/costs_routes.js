const express = require('express');
const router = express.Router();
const { addCostItem, getMonthlyReport } = require('../services/cost_logic');
const logger = require('../utils/logger');

/**
 * POST /api/add
 */
router.post('/add', async (req, res) => {
    try {
        const cost = await addCostItem(req.body);
        res.status(201).json(cost);
    } catch (error) {
        logger.error('Cost Addition Failed:', error);
        res.status(error.status || 400).json({ id: Date.now(), message: error.message });
    }
});

/**
 * GET /api/report
 */
router.get('/report', async (req, res) => {
    try {
        const { id, year, month } = req.query;
        if (!id || !year || !month) {
            return res.status(400).json({ message: 'Missing parameters: id, year, month' });
        }

        const report = await getMonthlyReport(id, year, month);
        res.status(200).json(report);
    } catch (error) {
        logger.error('Report Generation Failed:', error);
        res.status(error.status || 500).json({ message: error.message });
    }
});

module.exports = router;