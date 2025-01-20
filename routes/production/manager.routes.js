const express = require('express');
const router = express.Router();
const ProductionManagerController = require('../../controllers/production/manager.controller');
const authMiddleware = require('../../middleware/auth.middleware');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// W-Cut Bagmaking routes
router.get('/wcut/bagmaking', ProductionManagerController.listWCutBagmaking.bind(ProductionManagerController));
router.put('/wcut/bagmaking/update/:order_id', ProductionManagerController.updateWCutBagmaking.bind(ProductionManagerController));

// D-Cut Bagmaking routes
router.get('/dcut/bagmaking', ProductionManagerController.listDCutBagmaking.bind(ProductionManagerController));
router.put('/dcut/bagmaking/update/:order_id', ProductionManagerController.updateDCutBagmaking.bind(ProductionManagerController));

module.exports = router;