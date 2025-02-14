const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  order_id: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: false
  },
  type: { type: String, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Paid', 'Overdue', 'Cancelled'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

invoiceSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = invoiceSchema;