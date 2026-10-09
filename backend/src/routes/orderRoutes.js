const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticateToken, requireAdmin, optionalAuth } = require('../middlewares/authMiddleware');
const { validate, createOrderSchema, updateOrderStatusSchema } = require('../middlewares/validateMiddleware');

// Customer / Public Order creation (allows logged-in or guest checkout)
router.post('/', optionalAuth, validate(createOrderSchema), orderController.createOrder);

// Customer's order history
router.get('/my-orders', authenticateToken, orderController.getMyOrders);

// Track or get single order
router.get('/:id', optionalAuth, orderController.getOrderById);

// Customer attaches payment slip to existing order
router.patch('/:id/slip', optionalAuth, orderController.attachPaymentSlip);

// Admin only: view all orders, update status
router.get('/admin/all', authenticateToken, requireAdmin, orderController.getAllOrders);
router.patch('/admin/:id/status', authenticateToken, requireAdmin, validate(updateOrderStatusSchema), orderController.updateOrderStatus);

module.exports = router;
