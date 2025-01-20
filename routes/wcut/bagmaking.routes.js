const express = require('express');
const router = express.Router();
const WcutBagmakingController = require('../../controllers/wcut/bagmaking.controller');
const authMiddleware = require('../../middleware/auth.middleware');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// W-Cut Bag Making routes
router.get('/', WcutBagmakingController.list.bind(WcutBagmakingController));
router.get('/report', WcutBagmakingController.getReport.bind(WcutBagmakingController));
router.put('/:id', WcutBagmakingController.update.bind(WcutBagmakingController));

module.exports = router;