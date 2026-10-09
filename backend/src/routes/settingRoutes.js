const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController');
const { authenticateToken, requireAdmin, optionalAuth } = require('../middlewares/authMiddleware');

// Public read (shop name, BCEL QR code, phone)
router.get('/', optionalAuth, settingController.getSettings);

// Admin update & Telegram test
router.put('/', authenticateToken, requireAdmin, settingController.updateSettings);
router.post('/test-telegram', authenticateToken, requireAdmin, settingController.testTelegram);

module.exports = router;
