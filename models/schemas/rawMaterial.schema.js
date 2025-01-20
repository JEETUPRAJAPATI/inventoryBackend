const mongoose = require('mongoose');

const rawMaterialSchema = new mongoose.Schema({
  fabric_quality: {
    type: String,
    required: true,
    trim: true
  },
  roll_size: {
    type: String,
    required: true
  },
  gsm: {
    type: Number,
    required: true
  },
  fabric_color: {
    type: String,
    required: true
  },
  quantity_kgs: {
    type: Number,
    required: true,
    min: 0
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

rawMaterialSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = rawMaterialSchema;