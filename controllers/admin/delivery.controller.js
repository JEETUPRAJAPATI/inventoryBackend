const DeliveryQueryService = require('../../services/delivery/query.service');
const logger = require('../../utils/logger');

class DeliveryController {
  async getDeliveries(req, res) {
    try {
      const { delivery_status, date, page, limit } = req.query;
      
      const deliveries = await DeliveryQueryService.list({ 
        status: delivery_status, 
        dateRange: date ? `${date},${date}` : undefined,
        page, 
        limit 
      });
      
      res.json({
        success: true,
        data: deliveries.data,
        pagination: deliveries.pagination
      });
    } catch (error) {
      logger.error('Error fetching deliveries:', error);
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }
}

module.exports = new DeliveryController();