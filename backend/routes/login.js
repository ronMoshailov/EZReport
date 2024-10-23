// routes/userRoutes.js

const express = require('express');
const { createUser, getAllUsers, getUserById, checkUserExists } = require('../controller/login');

const router = express.Router();

// POST route to create a new user
router.post('/', checkUserExists);

// POST route to create a new user
router.post('/add', createUser);

// GET route to fetch all users
router.get('/all', getAllUsers);

// GET route to fetch a user by ID
router.get('/:id', checkUserExists);
//getUserById
module.exports = router;
