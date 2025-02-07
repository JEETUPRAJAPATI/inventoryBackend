
const mongoose = require('mongoose');

const OpsertReportSchema = new mongoose.Schema({
    orderId: { type: String, required: true, unique: true },
    status: { type: String, enum: ['pending', 'progress', 'completed'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', OpsertReportSchema);