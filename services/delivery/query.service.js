const Delivery = require('../../models/Delivery');
const logger = require('../../utils/logger');

class DeliveryQueryService {
  async findByOrderId(orderId) {
    try {
      return await Delivery.findOne({ 
        orderId,
        isDeleted: false 
      });
    } catch (error) {
      logger.error(`Error querying delivery by order ID ${orderId}:`, error);
      throw error;
    }
  }

  async findById(id) {
    try {
      return await Delivery.findOne({ 
        _id: id,
        isDeleted: false 
      });
    } catch (error) {
      logger.error(`Error querying delivery by ID ${id}:`, error);
      throw error;
    }
  }

  async list({ 
    status, 
    dateRange, 
    customerName,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    page = 1, 
    limit = 10 
  }) {
    try {
      const query = { isDeleted: false };
      
      if (status) query.status = status;
      if (customerName) query.customerName = new RegExp(customerName, 'i');
      
      if (dateRange) {
        const [startDate, endDate] = dateRange.split(',');
        query.createdAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      }

      const skip = (page - 1) * limit;
      const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
      
      const [deliveries, total] = await Promise.all([
        Delivery.find(query)
          .skip(skip)
          .limit(limit)
          .sort(sort),
        Delivery.countDocuments(query)
      ]);

      return {
        data: deliveries,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalRecords: total,
          hasNextPage: skip + deliveries.length < total,
          hasPrevPage: page > 1
        }
      };
    } catch (error) {
      logger.error('Error querying deliveries:', error);
      throw error;
    }
  }
}

module.exports = new DeliveryQueryService();