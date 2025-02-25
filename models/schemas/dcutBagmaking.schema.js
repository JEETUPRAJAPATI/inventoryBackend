const mongoose = require('mongoose');

const dcutBagmakingSchema = new mongoose.Schema({
  order_id: {
    type: String,
    required: true,
    trim: true
  },
  unit_number: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'billing', 'opsert', 'delivered'],
    default: 'pending'
  },
  remarks: {
    type: String,
    trim: true,
    required: false
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

dcutBagmakingSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = dcutBagmakingSchema;