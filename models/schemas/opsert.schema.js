const mongoose = require('mongoose');

const opsertSchema = new mongoose.Schema({
  jobName: {
    type: String,
    required: true,
    trim: true
  },
  bagType: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed'],
    default: 'pending'
  },
  operatorName: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  remarks: {
    type: String,
    trim: true
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

opsertSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = opsertSchema;