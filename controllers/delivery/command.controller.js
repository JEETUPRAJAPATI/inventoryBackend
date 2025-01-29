const DeliveryCommandService = require('../../services/delivery/command.service');
const DeliveryQueryService = require('../../services/delivery/query.service');
const { createDeliverySchema, updateDeliverySchema } = require('../../validators/delivery.validator');
const logger = require('../../utils/logger');

class DeliveryCommandController {
  async create(req, res) {

    console.log('request1', req);
    try {
      const { error, value } = createDeliverySchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message
        });
      }

      const delivery = await DeliveryCommandService.create(value);
      res.status(201).json({
        success: true,
        data: delivery
      });
    } catch (error) {
      logger.error('Error creating delivery:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async update(req, res) {
    try {

      const { error, value } = updateDeliverySchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message
        });
      }
      console.log('values', value);
      const delivery = await DeliveryCommandService.update(req.params.id, value);

      if (!delivery) {
        return res.status(404).json({
          success: false,
          message: 'Delivery not found'
        });
      }

      res.json({
        success: true,
        message: 'Delivery updated successfully',
        data: delivery
      });
    } catch (error) {
      logger.error('Error updating delivery:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async delete(req, res) {
    try {
      const delivery = await DeliveryCommandService.softDelete(req.params.id);

      if (!delivery) {
        return res.status(404).json({
          success: false,
          message: 'Delivery not found'
        });
      }

      res.json({
        success: true,
        message: 'Delivery deleted successfully'
      });
    } catch (error) {
      logger.error('Error deleting delivery:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new DeliveryCommandController();