const Joi = require('joi');

const salesOrderSchema = Joi.object({
  customerName: Joi.string().required(),
  email: Joi.string().email().required(),
  mobileNumber: Joi.string().pattern(/^[0-9]{10}$/).required(),
  address: Joi.string().required(),
  bagType: Joi.string().required(),
  handleColor: Joi.string(),
  size: Joi.string().required(),
  jobName: Joi.string().required(),
  bagColor: Joi.string(),
  printColor: Joi.string(),
  gsm: Joi.number().required(),
  fabricQuality: Joi.string().required(),
  quantity: Joi.number().min(1).required(),
  agent: Joi.string().required(),
  status: Joi.string().valid('pending', 'processing', 'completed', 'cancelled')
});

module.exports = {
  salesOrderSchema
};