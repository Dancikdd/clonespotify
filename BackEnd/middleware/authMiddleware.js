const jwt = require('jsonwebtoken');
const db = require('../db');
require('dotenv').config();

// Authentication middleware
exports.authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer')) {
      return res.status(401).json({ message: 'Authorization token required' });
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Authorization token required' });
    }
    
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Check if user exists
      const user = await db.query('SELECT id, email, name FROM users WHERE id = $1', [decoded.id]);
      
      if (user.rows.length === 0) {
        return res.status(401).json({ message: 'User not found' });
      }
      
      // Add user and isAdmin flag to request
      req.user = {
        id: user.rows[0].id,
        email: user.rows[0].email,
        name: user.rows[0].name,
        isAdmin: user.rows[0].email === process.env.ADMIN_EMAIL
      };
      
      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({ message: 'Invalid authorization token' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin middleware - must be used after authMiddleware
exports.adminMiddleware = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  next();
};