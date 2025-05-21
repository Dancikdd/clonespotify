const db = require('../db');

// Create a new playlist
exports.createPlaylist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, img_url } = req.body; // <-- use img_url here
    const result = await db.query(
      'INSERT INTO playlists (user_id, name, img_url) VALUES ($1, $2, $3) RETURNING *',
      [userId, name, img_url] // <-- use img_url here
    );
    res.status(201).json({ success: true, playlist: result.rows[0] });
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
      playlists: playlists.rows 
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
      return res.status(404).json({ message: 'Playlist not found' });
    }

    // Get songs in the playlist
    const songs = await db.query(
      `SELECT s.*
       FROM songs s
       JOIN playlist_songs ps ON s.id = ps.song_id
       WHERE ps.playlist_id = $1`,
      [id]
    );

    res.status(200).json({
      success: true,
      playlist: playlist.rows[0],
      songs: songs.rows // <-- this is what your frontend expects
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
    const { name, img_url } = req.body; // include img_url
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
      'UPDATE playlists SET name = $1, img_url = $2 WHERE id = $3 AND user_id = $4 RETURNING *',
      [name, img_url, id, userId]
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
    const playlistId = req.params.id;
    const userId = req.user.id;
    const { songId } = req.body;

    // Optional: Check if playlist belongs to user
    const playlistCheck = await db.query(
      'SELECT * FROM playlists WHERE id = $1 AND user_id = $2',
      [playlistId, userId]
    );
    if (playlistCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Playlist not found or access denied' });
    }

    // Add song to playlist_songs table
    await db.query(
      'INSERT INTO playlist_songs (playlist_id, song_id) VALUES ($1, $2)',
      [playlistId, songId]
    );

    res.status(200).json({ success: true, message: 'Song added to playlist' });
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

exports.getMadeForYou = async (req, res) => {
  try {
    // 1. Pick a random artist from the songs table
    const artistResult = await db.query(
      "SELECT artist FROM songs ORDER BY RANDOM() LIMIT 1"
    );
    if (artistResult.rows.length === 0) {
      return res.json({ songs: [] });
    }
    const artist = artistResult.rows[0].artist;

    // 2. Get 10 random songs by that artist
    const songsResult = await db.query(
      "SELECT * FROM songs WHERE artist = $1 ORDER BY RANDOM() LIMIT 10",
      [artist]
    );

    res.json({ artist, songs: songsResult.rows });
  } catch (error) {
    console.error("Get Made For You error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};