const mongoose = require('mongoose');

const productionDetailsSchema = new mongoose.Schema({
  roll_size: {
    type: String,
    required: true
  },
  cylinder_size: {
    type: String,
    required: true
  },
  quantity_in_kg: {
    type: Number,
    required: true,
    min: 0
  },
  quantity_in_roll: {
    type: Number,
    required: true,
    min: 0
  },
  remark: {
    type: String,
    trim: true
  }
});

const productionManagerSchema = new mongoose.Schema({
  order_id: {
    type: String,
    required: true,
    unique: true
  },
  production_type: {
    type: String,
    enum: ['wcut_bagmaking', 'dcut_bagmaking'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed'],
    default: 'pending'
  },
  production_details: productionDetailsSchema,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

productionManagerSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = productionManagerSchema;