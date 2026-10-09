const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const uploadController = require('../controllers/uploadController');
const { optionalAuth } = require('../middlewares/authMiddleware');

// Upload single image (Product image or Payment slip) - public/authenticated
router.post('/single', upload.single('image'), uploadController.uploadSingleImage);

// Upload multiple images
router.post('/multiple', upload.array('images', 8), uploadController.uploadMultipleImages);

module.exports = router;
