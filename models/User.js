const mongoose = require('mongoose');
const userSchema = require('./schemas/user.schema');

// Remove password when converting to JSON
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

// Instance method to check if user is production type
userSchema.methods.isProductionUser = function() {
  return this.registrationType === 'production';
};

// Static method to find active users by registration type
userSchema.statics.findActiveByType = function(registrationType) {
  return this.find({
    registrationType,
    status: 'active'
  });
};

module.exports = mongoose.model('User', userSchema);