const mongoose = require('mongoose');

const salesOrderSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  mobileNumber: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  bagDetails: {
    type: {
      type: String,
      required: true
    },
    handleColor: String,
    size: {
      type: String,
      required: true
    },
    color: String,
    printColor: String,
    gsm: {
      type: Number,
      required: true
    }
  },
  jobName: {
    type: String,
    required: true
  },
  fabricQuality: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  agent: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'cancelled'],
    default: 'pending'
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

salesOrderSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = salesOrderSchema;