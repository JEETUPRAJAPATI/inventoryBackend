const mongoose = require('mongoose');

const finishedProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  size: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  deleted: {
    type: Boolean,
    default: false,
  },
});

finishedProductSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = finishedProductSchema;