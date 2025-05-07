const db = require('../db');

// Create a new playlist
exports.createPlaylist = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.id;

    const newPlaylist = await db.query(
      'INSERT INTO playlists (name, user_id) VALUES ($1, $2) RETURNING *',
      [name, userId]
    );

    res.status(201).json({
      success: true,
      data: newPlaylist.rows[0]
    });
  } catch (error) {
    console.error('Create playlist error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all playlists for the current user
exports.getUserPlaylists = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const playlists = await db.query(
      'SELECT * FROM playlists WHERE user_id = $1 ORDER BY id ASC',
      [userId]
    );
    
    res.status(200).json({
      success: true,
      count: playlists.rows.length,
      data: playlists.rows
    });
  } catch (error) {
    console.error('Get user playlists error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get playlist by ID with songs
exports.getPlaylistById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Get playlist info
    const playlist = await db.query(
      'SELECT * FROM playlists WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    
    if (playlist.rows.length === 0) {
      return res.status(404).json({ message: 'Playlist not found or access denied' });
    }
    
    // Get songs in the playlist
    const songs = await db.query(
      `SELECT s.* FROM songs s 
       JOIN playlist_songs ps ON s.id = ps.song_id 
       WHERE ps.playlist_id = $1 
       ORDER BY s.title ASC`,
      [id]
    );
    
    res.status(200).json({
      success: true,
      data: {
        ...playlist.rows[0],
        songs: songs.rows
      }
    });
  } catch (error) {
    console.error('Get playlist by ID error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update playlist by ID
exports.updatePlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const userId = req.user.id;
    
    // Check if playlist exists and belongs to user
    const playlistCheck = await db.query(
      'SELECT * FROM playlists WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    
    if (playlistCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Playlist not found or access denied' });
    }
    
    const updatedPlaylist = await db.query(
      'UPDATE playlists SET name = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
      [name, id, userId]
    );
    
    res.status(200).json({
      success: true,
      data: updatedPlaylist.rows[0]
    });
  } catch (error) {
    console.error('Update playlist error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete playlist by ID
exports.deletePlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Check if playlist exists and belongs to user
    const playlistCheck = await db.query(
      'SELECT * FROM playlists WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    
    if (playlistCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Playlist not found or access denied' });
    }
    
    // Delete playlist (cascade will delete playlist_songs entries)
    await db.query('DELETE FROM playlists WHERE id = $1 AND user_id = $2', [id, userId]);
    
    res.status(200).json({
      success: true,
      message: 'Playlist deleted successfully'
    });
  } catch (error) {
    console.error('Delete playlist error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add song to playlist
exports.addSongToPlaylist = async (req, res) => {
  try {
    const { playlistId, songId } = req.body;
    const userId = req.user.id;
    
    // Check if playlist exists and belongs to user
    const playlistCheck = await db.query(
      'SELECT * FROM playlists WHERE id = $1 AND user_id = $2',
      [playlistId, userId]
    );
    
    if (playlistCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Playlist not found or access denied' });
    }
    
    // Check if song exists
    const songCheck = await db.query('SELECT * FROM songs WHERE id = $1', [songId]);
    if (songCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Song not found' });
    }
    
    // Check if song is already in the playlist
    const existingEntry = await db.query(
      'SELECT * FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2',
      [playlistId, songId]
    );
    
    if (existingEntry.rows.length > 0) {
      return res.status(400).json({ message: 'Song already in playlist' });
    }
    
    // Add song to playlist
    await db.query(
      'INSERT INTO playlist_songs (playlist_id, song_id) VALUES ($1, $2)',
      [playlistId, songId]
    );
    
    res.status(201).json({
      success: true,
      message: 'Song added to playlist successfully'
    });
  } catch (error) {
    console.error('Add song to playlist error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Remove song from playlist
exports.removeSongFromPlaylist = async (req, res) => {
  try {
    const { playlistId, songId } = req.params;
    const userId = req.user.id;
    
    // Check if playlist exists and belongs to user
    const playlistCheck = await db.query(
      'SELECT * FROM playlists WHERE id = $1 AND user_id = $2',
      [playlistId, userId]
    );
    
    if (playlistCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Playlist not found or access denied' });
    }
    
    // Remove song from playlist
    await db.query(
      'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2',
      [playlistId, songId]
    );
    
    res.status(200).json({
      success: true,
      message: 'Song removed from playlist successfully'
    });
  } catch (error) {
    console.error('Remove song from playlist error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};