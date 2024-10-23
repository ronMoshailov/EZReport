// controllers/userController.js

const mongoose = require('mongoose');
const User = require('../model/login');  // Import the User model
const { log, error } = require('../libs/login');  // Import the logger

// Function to create a new user
const createUser = async (req, res) => {
    const { id, name } = req.body;

    try {
        // Create a new User instance
        const newUser = new User({ id, name });

        // Save the user to the database
        await newUser.save();

        log(`User created: ${newUser.name}`);
        res.status(201).json(newUser);  // Send the created user as the response
    } catch (err) {
        error(`Failed to create user: ${err.message}`);
        res.status(500).json({ message: 'Failed to create user' });
    }
};

// Function to get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        log(`Fetched ${users.length} users`);
        res.status(200).json(users);
    } catch (err) {
        error(`Failed to fetch users: ${err.message}`);
        res.status(500).json({ message: 'Failed to fetch users' });
    }
};

// Function to get a user by ID
const getUserById = async (req, res) => {
    try {
        const user = await User.findOne({ id: req.params.id });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        log(`Fetched user: ${user.name}`);
        res.status(200).json(user);
    } catch (err) {
        error(`Failed to fetch user: ${err.message}`);
        res.status(500).json({ message: 'Failed to fetch user' });
    }
};

// Function to check if a user exists by ID
const checkUserExists = async (req, res) => {
    const { employeeNumber } = req.body;

    try {
        const employee = await Employee.findOne({ employeeNumber });

        if (employee) {
            res.status(200).json({ message: 'Employee exists', employee });
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error checking employee', error });
    }
};


// Export the controller functions
module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    checkUserExists
};
