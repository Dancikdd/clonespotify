const express = require('express');
const router = express.Router();
const songController = require('../controllers/songController');
const playlistController = require('../controllers/playlistController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const { uploadAudio } = require('../middleware/uploadMiddleware');

// Public routes
router.get('/', songController.getAllSongs);
router.get('/search', songController.searchSongs);

// Protected user routes
router.get('/user/liked', authMiddleware, songController.getLikedSongs);
router.get('/recently-played', authMiddleware, songController.getRecentlyPlayed);
router.post('/recently-played', authMiddleware, songController.addRecentlyPlayed);

// Admin only routes (protected)
router.post('/', authMiddleware, adminMiddleware, uploadAudio, songController.createSong);
router.put('/:id', authMiddleware, adminMiddleware, uploadAudio, songController.updateSong);
router.delete('/:id', authMiddleware, adminMiddleware, songController.deleteSong);

// Like/Unlike a song
router.post('/:id/like', authMiddleware, songController.likeSong);
router.delete('/:id/like', authMiddleware, songController.unlikeSong);

// Recommended stations route
router.get('/recommended', playlistController.getRecommendedStations);

// Public route (must be last)
router.get('/:id', songController.getSongById);

module.exports = router;