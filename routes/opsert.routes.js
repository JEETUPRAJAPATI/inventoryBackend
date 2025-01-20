const express = require('express');
const router = express.Router();
const OpsertController = require('../controllers/opsert.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Opsert routes
router.get('/', OpsertController.list.bind(OpsertController));
router.get('/report', OpsertController.getReport.bind(OpsertController));
router.put('/:id', OpsertController.update.bind(OpsertController));

module.exports = router;