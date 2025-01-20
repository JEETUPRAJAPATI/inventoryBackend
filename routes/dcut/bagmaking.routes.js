const express = require('express');
const router = express.Router();
const DcutBagmakingController = require('../../controllers/dcut/bagmaking.controller');
const authMiddleware = require('../../middleware/auth.middleware');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// D-Cut Bag Making routes
router.get('/', DcutBagmakingController.list.bind(DcutBagmakingController));
router.get('/report', DcutBagmakingController.getReport.bind(DcutBagmakingController));
router.put('/:id', DcutBagmakingController.update.bind(DcutBagmakingController));

module.exports = router;