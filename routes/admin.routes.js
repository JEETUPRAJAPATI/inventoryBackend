const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/admin.controller');
const SalesController = require('../controllers/admin/sales.controller');
const DeliveryController = require('../controllers/admin/delivery.controller');
const productionRoutes = require('./admin/production.routes');
const adminAuthMiddleware = require('../middleware/adminAuth.middleware');
const upload = require('../middleware/upload');

// Apply admin authentication middleware to all routes
router.use(adminAuthMiddleware);

// User management routes
router.get('/users', AdminController.getUsers.bind(AdminController));
router.get('/users/:id', AdminController.getUserById.bind(AdminController));
router.post('/users', 
  upload.single('profileImage'),
  AdminController.createUser.bind(AdminController)
);
router.put('/users/:id', AdminController.updateUser.bind(AdminController));
router.delete('/users/:id', AdminController.deleteUser.bind(AdminController));

// Sales routes
router.get('/sales', SalesController.getSales.bind(SalesController));

// Delivery routes
router.get('/delivery', DeliveryController.getDeliveries.bind(DeliveryController));

// Production routes
router.use('/production', productionRoutes);

module.exports = router;