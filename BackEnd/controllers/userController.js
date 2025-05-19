const db = require('../db');
const bcrypt = require('bcryptjs');

// Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    // Only admin can access this endpoint
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    
    const users = await db.query('SELECT id, email, name FROM users ORDER BY id ASC');
    
    res.status(200).json({
      success: true,
      count: users.rows.length,
      data: users.rows
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await db.query('SELECT id, email, name FROM users WHERE id = $1', [userId]);
    
    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({
      success: true,
      data: user.rows[0]
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, password } = req.body;
    
    // Check if user exists
    const user = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if email is already taken by another user
    if (email) {
      const emailCheck = await db.query('SELECT * FROM users WHERE email = $1 AND id != $2', [email, userId]);
      if (emailCheck.rows.length > 0) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }
    
    // Prepare update fields
    let updateFields = [];
    let queryParams = [];
    let paramCounter = 1;
    
    if (name) {
      updateFields.push(`name = $${paramCounter}`);
      queryParams.push(name);
      paramCounter++;
    }
    
    if (email) {
      updateFields.push(`email = $${paramCounter}`);
      queryParams.push(email);
      paramCounter++;
    }
    
    if (password) {
      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      updateFields.push(`password_hash = $${paramCounter}`);
      queryParams.push(hashedPassword);
      paramCounter++;
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }
    
    // Add user ID as the last parameter
    queryParams.push(userId);
    
    // Update user
    const updatedUser = await db.query(
      `UPDATE users SET ${updateFields.join(', ')} WHERE id = $${paramCounter} RETURNING id, email, name`,
      queryParams
    );
    
    res.status(200).json({
      success: true,
      data: updatedUser.rows[0]
    });
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete user (Admin only or own account)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user can perform this action (admin or deleting own account)
    if (req.user.id !== parseInt(id) && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Check if user exists
    const user = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Delete user
    await db.query('DELETE FROM users WHERE id = $1', [id]);
    
    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Placeholder for adding a liked song
exports.addLikedSong = async (req, res) => {
  try {
    // In a real implementation, you would add the song to the user's liked songs in the database
    console.log('addLikedSong route hit');
    res.status(200).json({ success: true, message: 'Placeholder: Song added to liked songs' });
  } catch (error) {
    console.error('Placeholder addLikedSong error:', error);
    res.status(500).json({ message: 'Placeholder server error', error: error.message });
  }
};

// Placeholder for removing a liked song
exports.removeLikedSong = async (req, res) => {
  try {
    const { songId } = req.params;
    // In a real implementation, you would remove the song from the user's liked songs in the database
    console.log(`removeLikedSong route hit for songId: ${songId}`);
    res.status(200).json({ success: true, message: `Placeholder: Song ${songId} removed from liked songs` });
  } catch (error) {
    console.error('Placeholder removeLikedSong error:', error);
    res.status(500).json({ message: 'Placeholder server error', error: error.message });
  }
};

// Placeholder for getting liked songs
exports.getLikedSongs = async (req, res) => {
  try {
    // In a real implementation, you would fetch the user's liked songs from the database
    console.log('getLikedSongs route hit');
    res.status(200).json({ success: true, data: [] }); // Returning an empty array for now
  } catch (error) {
    console.error('Placeholder getLikedSongs error:', error);
    res.status(500).json({ message: 'Placeholder server error', error: error.message });
  }
};