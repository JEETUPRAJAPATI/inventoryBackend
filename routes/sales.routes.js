const express = require('express');
const router = express.Router();
const SalesOrderController = require('../controllers/salesOrder.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Sales Order Routes
router.post('/orders', SalesOrderController.createOrder.bind(SalesOrderController));
router.get('/orders', SalesOrderController.getOrders.bind(SalesOrderController));
router.get('/orders/:id', SalesOrderController.getOrderById.bind(SalesOrderController));
router.put('/orders/:id', SalesOrderController.updateOrder.bind(SalesOrderController));
router.delete('/orders/:id', SalesOrderController.deleteOrder.bind(SalesOrderController));

module.exports = router;