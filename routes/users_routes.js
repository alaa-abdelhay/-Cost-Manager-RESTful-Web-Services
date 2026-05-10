'use strict';

const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, getUserTotalCost, addUser } = require('../services/user_logic');
const logger = require('../utils/logger');

// Helper to format error responses as required { id, message }
const errorBody = (id, message) => ({ id: id || null, message });

/*
 * GET /api/users
 */

router.get('/users', async (req, res) => {
    try {
        const users = await getAllUsers();
        res.json(users);
    } catch (error) {
        logger.error('Failed to get all users', error);
        res.status(500).json(errorBody(null, 'Internal server error'));
    }
});

/*
 * GET /api/users/:id
 * Fetches user details and calculates total costs.
 */

router.get('/users/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) return res.status(400).json(errorBody(null, 'Invalid ID format'));

        const user = await getUserById(id);
        if (!user) return res.status(404).json(errorBody(id, 'User not found'));

        const total = await getUserTotalCost(id);

        res.status(200).json({
            first_name: user.first_name,
            last_name: user.last_name,
            id: user.id,
            total
        });
    } catch (error) {
        logger.error(`Error fetching user ${req.params.id}`, error);
        res.status(500).json(errorBody(null, 'Internal server error'));
    }
});

/*
 * POST /api/add
 */

router.post('/add', async (req, res) => {
    try {
        const createdUser = await addUser(req.body);
        res.status(201).json(createdUser);
    } catch (error) {
        logger.error('Error creating user', error);
        res.status(400).json(errorBody(req.body.id, error.message));
    }
});

module.exports = router;