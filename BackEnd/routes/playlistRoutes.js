const express = require('express');
const router = express.Router();
const playlistController = require('../controllers/playlistController');
const { authMiddleware } = require('../middleware/authMiddleware');

// All routes are protected
router.use(authMiddleware);

// Create a new playlist
router.post('/', playlistController.createPlaylist);

// Get all playlists for current user
router.get('/', playlistController.getUserPlaylists);

// Get "Made for You" playlists
router.get('/made-for-you', playlistController.getMadeForYou);

// Get playlist by ID with songs
router.get('/:id', playlistController.getPlaylistById);

// Update playlist
router.put('/:id', playlistController.updatePlaylist);

// Delete playlist
router.delete('/:id', playlistController.deletePlaylist);

// Add song to playlist
router.post('/:id/songs', playlistController.addSongToPlaylist);

// Remove song from playlist
router.delete('/:playlistId/songs/:songId', playlistController.removeSongFromPlaylist);

module.exports = router;