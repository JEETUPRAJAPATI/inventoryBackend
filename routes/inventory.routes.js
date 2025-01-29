const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const RawMaterialController = require('../controllers/inventory/rawMaterial.controller');
const FinishedProductController = require('../controllers/inventory/finishedProduct.controller');
const PurchaseOrderController = require('../controllers/inventory/purchaseOrder.controller');
const InvoiceController = require('../controllers/inventory/invoice.controller');
const PackageController = require('../controllers/inventory/package.controller');
const DeliveryController = require('../controllers/inventory/delivery.controller');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Raw Material routes
router.post('/raw-material', RawMaterialController.create.bind(RawMaterialController));
router.get('/raw-materials', RawMaterialController.list.bind(RawMaterialController));
router.put('/raw-material/:id', RawMaterialController.update.bind(RawMaterialController));

// Finished Product routes
router.post('/finished-product', FinishedProductController.create.bind(FinishedProductController));
router.get('/finished-products', FinishedProductController.list.bind(FinishedProductController));
router.put('/finished-products/:id', FinishedProductController.update.bind(FinishedProductController));
router.delete('/finished-products/:id', FinishedProductController.delete.bind(FinishedProductController));

// Purchase Order routes
router.post('/purchase-order', PurchaseOrderController.create.bind(PurchaseOrderController));
router.get('/purchase-orders', PurchaseOrderController.list.bind(PurchaseOrderController));
router.put('/purchase-orders/:id', PurchaseOrderController.update.bind(PurchaseOrderController));
router.delete('/purchase-orders/:id', PurchaseOrderController.delete.bind(PurchaseOrderController));


// Invoice routes
router.post('/invoice', InvoiceController.create.bind(InvoiceController));
router.get('/invoices', InvoiceController.list.bind(InvoiceController));

// Package routes
router.post('/package', PackageController.create.bind(PackageController));
router.get('/packages/order/', PackageController.getOrders.bind(PackageController));
router.get('/packages/order/:orderId', PackageController.getByOrderId.bind(PackageController));
router.put('/package/:orderId/:packageId', PackageController.update.bind(PackageController));


router.get('/delivery', DeliveryController.list.bind(DeliveryController));
router.put('/delivery/:id', DeliveryController.update.bind(DeliveryController));
module.exports = router;