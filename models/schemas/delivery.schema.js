const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
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
  vehicleNumber: {
    type: String,
    required: true
  },
  notes: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'in transit', 'delivered', 'cancelled'],
    default: 'pending'
  },
  isDeleted: {
    type: Boolean,
    default: false
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

deliverySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = deliverySchema;