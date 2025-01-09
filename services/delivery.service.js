const Delivery = require('../models/Delivery');
const logger = require('../utils/logger');

class DeliveryService {
  async getDeliveries({ delivery_status, date, page = 1, limit = 10 }) {
    try {
      const query = {};
      if (delivery_status) query.deliveryStatus = delivery_status;
      if (date) query.deliveryDate = new Date(date);

      const skip = (page - 1) * limit;
      
      const [deliveries, total] = await Promise.all([
        Delivery.find(query).skip(skip).limit(limit),
        Delivery.countDocuments(query)
      ]);

      return {
        data: deliveries,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalRecords: total
        }
      };
    } catch (error) {
      logger.error('Error fetching deliveries:', error);
      throw error;
    }
  }
}

module.exports = new DeliveryService();