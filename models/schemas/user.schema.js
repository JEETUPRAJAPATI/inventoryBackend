const mongoose = require('mongoose');
const { REGISTRATION_TYPES, OPERATOR_TYPES, BAG_TYPES } = require('../../config/constants');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  mobileNumber: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  address: {
    type: String,
    trim: true
  },
  profileImage: {
    type: String
  },
  registrationType: {
    type: String,
    required: true,
    enum: Object.values(REGISTRATION_TYPES)
  },
  bagType: {
    type: String,
    enum: [...Object.values(BAG_TYPES), ''],
    required: function() {
      return this.registrationType === REGISTRATION_TYPES.PRODUCTION;
    }
  },
  operatorType: {
    type: String,
    enum: [...Object.values(OPERATOR_TYPES), ''],
    required: function() {
      return this.registrationType === REGISTRATION_TYPES.PRODUCTION;
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  lastLogin: {
    type: Date
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

// Middleware to update the updatedAt field
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = userSchema;