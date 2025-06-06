const db = require('../db');
const fs = require('fs');
const path = require('path');
const { addSongToPlaylist } = require('./playlistController');

// Create a new song (Admin only)
exports.createSong = async (req, res) => {
  try {
    const { title, artist, album, duration } = req.body;
    let audioUrl = null;

    // If file was uploaded
    if (req.file) {
      audioUrl = `/uploads/audio/${req.file.filename}`;
    }

    const newSong = await db.query(
      'INSERT INTO songs (title, artist, album, duration, audio_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, artist, album, duration, audioUrl]
    );

    res.status(201).json({
      success: true,
      data: newSong.rows[0]
    });
  } catch (error) {
    console.error('Create song error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all songs
exports.getAllSongs = async (req, res) => {
  try {
    const songs = await db.query('SELECT * FROM songs ORDER BY title ASC');
    
    res.status(200).json({
      success: true,
      count: songs.rows.length,
      data: songs.rows
    });
  } catch (error) {
    console.error('Get all songs error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single song by ID
exports.getSongById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const song = await db.query('SELECT * FROM songs WHERE id = $1', [id]);
    
    if (song.rows.length === 0) {
      return res.status(404).json({ message: 'Song not found' });
    }
    
    res.status(200).json({
      success: true,
      data: song.rows[0]
    });
  } catch (error) {
    console.error('Get song by ID error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update song by ID (Admin only)
exports.updateSong = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, artist, album, duration } = req.body;
    
    // Check if song exists
    const songCheck = await db.query('SELECT * FROM songs WHERE id = $1', [id]);
    if (songCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Song not found' });
    }
    
    let audioUrl = songCheck.rows[0].audio_url;
    
    // If new file was uploaded
    if (req.file) {
      // Delete old file if exists
      if (audioUrl) {
        const oldFilePath = path.join(__dirname, '..', audioUrl);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      audioUrl = `/uploads/audio/${req.file.filename}`;
    }
    
    const updatedSong = await db.query(
      'UPDATE songs SET title = $1, artist = $2, album = $3, duration = $4, audio_url = $5 WHERE id = $6 RETURNING *',
      [title, artist, album, duration, audioUrl, id]
    );
    
    res.status(200).json({
      success: true,
      data: updatedSong.rows[0]
    });
  } catch (error) {
    console.error('Update song error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete song by ID (Admin only)
exports.deleteSong = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if song exists and get audio file path
    const song = await db.query('SELECT * FROM songs WHERE id = $1', [id]);
    if (song.rows.length === 0) {
      return res.status(404).json({ message: 'Song not found' });
    }
    
    // Delete audio file if exists
    if (song.rows[0].audio_url) {
      const filePath = path.join(__dirname, '..', song.rows[0].audio_url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    // Delete song from database
    await db.query('DELETE FROM songs WHERE id = $1', [id]);
    
    res.status(200).json({
      success: true,
      message: 'Song deleted successfully'
    });
  } catch (error) {
    console.error('Delete song error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Search songs
exports.searchSongs = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    const searchTerm = `%${query}%`;
    
    const songs = await db.query(
      'SELECT * FROM songs WHERE title ILIKE $1 OR artist ILIKE $1 OR album ILIKE $1 ORDER BY title ASC',
      [searchTerm]
    );
    
    res.status(200).json({
      success: true,
      count: songs.rows.length,
      data: songs.rows
    });
  } catch (error) {
    console.error('Search songs error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.likeSong = async (req, res) => {
  const userId = req.user.id;
  const songId = req.params.id;
  try {
    await db.query(
      'INSERT INTO liked_songs (user_id, song_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [userId, songId]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.unlikeSong = async (req, res) => {
  const userId = req.user.id;
  const songId = req.params.id;
  try {
    await db.query(
      'DELETE FROM liked_songs WHERE user_id = $1 AND song_id = $2',
      [userId, songId]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getLikedSongs = async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await db.query(
      `SELECT songs.* FROM liked_songs
       JOIN songs ON liked_songs.song_id = songs.id
       WHERE liked_songs.user_id = $1`,
      [userId]
    );
    res.json({ songs: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addRecentlyPlayed = async (req, res) => {
  const userId = req.user.id;
  const { songId } = req.body;
  console.log("addRecentlyPlayed called with:", { userId, songId });
  try {
    // Remove any previous entry for this user and song
    await db.query(
      `DELETE FROM recently_played WHERE user_id = $1 AND song_id = $2`,
      [userId, songId]
    );
    // Insert the new entry
    await db.query(
      `INSERT INTO recently_played (user_id, song_id) VALUES ($1, $2)`,
      [userId, songId]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRecentlyPlayed = async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await db.query(
      `SELECT s.* FROM recently_played rp
       JOIN songs s ON rp.song_id = s.id
       WHERE rp.user_id = $1
       ORDER BY rp.played_at DESC
       LIMIT 20`,
      [userId]
    );
    res.json({ songs: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};