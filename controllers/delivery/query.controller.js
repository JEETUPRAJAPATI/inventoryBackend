const DeliveryQueryService = require('../../services/delivery/query.service');
const logger = require('../../utils/logger');

class DeliveryQueryController {
  async getById(req, res) {
    try {
      const { id } = req.params;
      const delivery = await DeliveryQueryService.findById(id);

      if (!delivery) {
        return res.status(404).json({
          success: false,
          message: 'Delivery not found'
        });
      }

      res.json({
        success: true,
        data: delivery
      });
    } catch (error) {
      logger.error('Error fetching delivery by ID:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getByOrderId(req, res) {
    try {
      const { orderId } = req.params;
      const delivery = await DeliveryQueryService.findByOrderId(orderId);

      if (!delivery) {
        return res.status(404).json({
          success: false,
          message: 'Delivery not found'
        });
      }

      res.json({
        success: true,
        data: delivery
      });
    } catch (error) {
      logger.error('Error fetching delivery:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async list(req, res) {
    try {
      const {
        status,
        dateRange,
        customerName,
        sortBy,
        sortOrder,
        page,
        limit
      } = req.query;

      // Handle the case where status is 'all'
      let query = {};
      if (status && status !== 'all') {
        query.status = status; // Only add status to query if it is not 'all'
      }

      const result = await DeliveryQueryService.list({
        query, // Pass query to the service
        dateRange,
        customerName,
        sortBy,
        sortOrder,
        page,
        limit
      });

      console.log('result', result);
      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      logger.error('Error listing deliveries:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

}

module.exports = new DeliveryQueryController();