const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Register route
router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;

  // Email validation
  const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Email must be lowercase and valid." });
  }
  // Password validation
  if (!password || password.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters long." });
  }
  // Check if email already exists
  const userExists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
  if (userExists.rows.length > 0) {
    return res.status(400).json({ message: "Email already registered." });
  }

  try {
    // Hash password
    const password_hash = await bcrypt.hash(password, 10);
    // Insert user
    const newUser = await pool.query(
      'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING *',
      [email, password_hash, name]
    );
    // Generate JWT
    const token = jwt.sign(
      { id: newUser.rows[0].id, email, name, is_admin: newUser.rows[0].is_admin },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRESIN || '24h' }
    );
    res.json({ token, is_admin: newUser.rows[0].is_admin, name: newUser.rows[0].name });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    // Generate JWT token (same as register)
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, is_admin: user.is_admin },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRESIN || '24h' }
    );
    res.json({ token, is_admin: user.is_admin, name: user.name });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user (Protected route)
router.get('/me', authMiddleware, authController.getCurrentUser);

// Logout route (Protected)
router.post('/logout', authMiddleware, async (req, res) => {
  try {
    // In a real application, you might want to blacklist the token
    // For now, we'll just send a success response
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;