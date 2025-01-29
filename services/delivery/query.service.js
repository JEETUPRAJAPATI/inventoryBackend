const Delivery = require('../../models/Delivery');
const SalesOrder = require('../../models/SalesOrder'); // Assuming this is your salesorders model
const logger = require('../../utils/logger');

class DeliveryQueryService {

  async findById(id) {
    try {
      const delivery = await Delivery.findById(id);
      if (!delivery) {
        throw new Error('Delivery not found');
      }

      return delivery;
    } catch (error) {
      logger.error('Error fetching delivery by ID:', error);
      throw error;
    }
  }

  async findByOrderId(orderId) {
    try {
      const delivery = await Delivery.findOne({ orderId }); // Populate if needed
      return delivery;
    } catch (error) {
      logger.error('Error fetching delivery by Order ID:', error);
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
      const query = {};

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

      // Fetch deliveries with pagination
      const [deliveries, total] = await Promise.all([
        Delivery.find(query)
          .skip(skip)
          .limit(limit)
          .sort(sort),
        Delivery.countDocuments(query)
      ]);

      // Fetch order details from salesorders table
      const enrichedDeliveries = await Promise.all(
        deliveries.map(async (delivery) => {
          const orderDetails = await SalesOrder.findOne({ orderId: delivery.orderId });
          return {
            ...delivery.toObject(),
            orderDetails: orderDetails ? orderDetails.toObject() : null
          };
        })
      );

      return {
        data: enrichedDeliveries,
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

  // Delete a sale order by ID
  async deleteDelivery(id) {
    try {
      const result = await Delivery.findByIdAndDelete(id);
      return result ? true : false;
    } catch (error) {
      logger.error('Error deleting order:', error);
      throw error;
    }
  }
}

module.exports = new DeliveryQueryService();
