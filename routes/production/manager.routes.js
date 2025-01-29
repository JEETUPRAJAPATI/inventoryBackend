const express = require('express');
const router = express.Router();
const ProductionManagerController = require('../../controllers/production/manager.controller');
const authMiddleware = require('../../middleware/auth.middleware');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// W-Cut Bagmaking routes
router.get('/wcut/bagmaking', ProductionManagerController.listWCutBagmaking.bind(ProductionManagerController));
router.put('/update/:order_id', ProductionManagerController.updateData.bind(ProductionManagerController));
router.get('/get/:order_id', ProductionManagerController.getData.bind(ProductionManagerController));
router.get('/view/:order_id', ProductionManagerController.viewOrderDetails.bind(ProductionManagerController));

// D-Cut Bagmaking routes
router.get('/dcut/bagmaking', ProductionManagerController.listDCutBagmaking.bind(ProductionManagerController));

module.exports = router;