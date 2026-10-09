const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateToken, requireAdmin } = require('../middlewares/authMiddleware');
const { validate, productSchema } = require('../middlewares/validateMiddleware');

// Public
router.get('/', productController.getProducts);
router.get('/detail/:id', productController.getProductById);

// Admin only
router.get('/admin/low-stock', authenticateToken, requireAdmin, productController.getLowStock);
router.post('/', authenticateToken, requireAdmin, validate(productSchema), productController.createProduct);
router.put('/:id', authenticateToken, requireAdmin, productController.updateProduct);
router.delete('/:id', authenticateToken, requireAdmin, productController.deleteProduct);

module.exports = router;
