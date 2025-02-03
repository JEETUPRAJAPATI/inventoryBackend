const Joi = require('joi');

const createDeliverySchema = Joi.object({
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
  vehicleNumber: Joi.string().required(),
  notes: Joi.string(),
  status: Joi.string().valid('pending', 'in_transit', 'delivered', 'cancelled')
});

const updateDeliverySchema = Joi.object({
  vehicleNo: Joi.string(),
  driverName: Joi.string(),
  driverContact: Joi.string().pattern(/^[0-9]{10}$/),
  deliveryDate: Joi.date(),
  status: Joi.string().valid('pending', 'in_transit', 'delivered', 'cancelled').optional(),

}).min(1);

module.exports = {
  createDeliverySchema,
  updateDeliverySchema
};