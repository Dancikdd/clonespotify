const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// Protected routes
router.use(authMiddleware);

// Get user profile
router.get('/profile', userController.getUserProfile);

// Update user profile
router.put('/profile', userController.updateUserProfile);

// Get all users (Admin only)
router.get('/', adminMiddleware, userController.getAllUsers);

// Delete user (Admin or own account)
router.delete('/:id', userController.deleteUser);

module.exports = router;