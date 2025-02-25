const mongoose = require('mongoose');

const flexoSchema = new mongoose.Schema({
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
    enum: ['pending', 'in_progress', 'completed', 'delivered', 'billing'],
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

flexoSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = flexoSchema;