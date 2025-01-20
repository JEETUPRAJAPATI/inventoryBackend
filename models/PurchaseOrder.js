const mongoose = require('mongoose');
const purchaseOrderSchema = require('./schemas/purchaseOrder.schema');

module.exports = mongoose.model('PurchaseOrder', purchaseOrderSchema);