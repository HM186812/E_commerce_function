const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticateToken, requireAdmin } = require('../middlewares/authMiddleware');
const { validate, categorySchema } = require('../middlewares/validateMiddleware');

// Public
router.get('/', categoryController.getAllCategories);

// Admin only
router.post('/', authenticateToken, requireAdmin, validate(categorySchema), categoryController.createCategory);
router.put('/:id', authenticateToken, requireAdmin, categoryController.updateCategory);
router.delete('/:id', authenticateToken, requireAdmin, categoryController.deleteCategory);

module.exports = router;
