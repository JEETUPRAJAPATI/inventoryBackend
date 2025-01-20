const Joi = require('joi');

// Define bagDetails schema for Joi validation
const bagDetailsSchema = Joi.object({
  type: Joi.string().required(),
  handleColor: Joi.string(),
  size: Joi.string().required(),
  color: Joi.string(),
  printColor: Joi.string(),
  gsm: Joi.number().required()
});

// Define the main salesOrder schema for Joi validation
const salesOrderSchema = Joi.object({
  customerName: Joi.string().required(),
  email: Joi.string().email().required(),
  mobileNumber: Joi.string().pattern(/^[0-9]{10}$/).required(),
  address: Joi.string().required(),
  bagDetails: bagDetailsSchema.required(),
  jobName: Joi.string().required(),
  fabricQuality: Joi.string().required(),
  quantity: Joi.number().min(1).required(),
  agent: Joi.string().required(),
  status: Joi.string().valid('pending', 'processing', 'completed', 'cancelled')
});

module.exports = {
  salesOrderSchema
};
