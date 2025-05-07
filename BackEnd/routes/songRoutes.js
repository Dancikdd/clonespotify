const express = require('express');
const router = express.Router();
const songController = require('../controllers/songController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const { uploadAudio } = require('../middleware/uploadMiddleware');

// Public routes
router.get('/', songController.getAllSongs);
router.get('/search', songController.searchSongs);
router.get('/:id', songController.getSongById);

// Admin only routes (protected)
router.post('/', authMiddleware, adminMiddleware, uploadAudio, songController.createSong);
router.put('/:id', authMiddleware, adminMiddleware, uploadAudio, songController.updateSong);
router.delete('/:id', authMiddleware, adminMiddleware, songController.deleteSong);

module.exports = router;