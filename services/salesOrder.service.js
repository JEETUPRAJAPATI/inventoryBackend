const SalesOrder = require('../models/SalesOrder');
const logger = require('../utils/logger');

class SalesOrderService {
  async createOrder(orderData) {
    try {
      const order = new SalesOrder({
        customerName: orderData.customerName,
        email: orderData.email,
        mobileNumber: orderData.mobileNumber,
        address: orderData.address,
        bagDetails: {
          type: orderData.bagType,
          handleColor: orderData.handleColor,
          size: orderData.size,
          color: orderData.bagColor,
          printColor: orderData.printColor,
          gsm: orderData.gsm
        },
        jobName: orderData.jobName,
        fabricQuality: orderData.fabricQuality,
        quantity: orderData.quantity,
        agent: orderData.agent,
        status: orderData.status || 'pending'
      });

      return await order.save();
    } catch (error) {
      logger.error('Error creating sales order:', error);
      throw error;
    }
  }

  async getOrders({ status, agent, page = 1, limit = 10 }) {
    try {
      const query = {};
      if (status) query.status = status;
      if (agent) query.agent = agent;

      const skip = (page - 1) * limit;
      
      const [orders, total] = await Promise.all([
        SalesOrder.find(query).skip(skip).limit(limit),
        SalesOrder.countDocuments(query)
      ]);

      return {
        data: orders,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalRecords: total
        }
      };
    } catch (error) {
      logger.error('Error fetching sales orders:', error);
      throw error;
    }
  }

  async getOrderById(orderId) {
    try {
      const order = await SalesOrder.findById(orderId);
      if (!order) {
        throw new Error('Order not found');
      }
      return order;
    } catch (error) {
      logger.error(`Error fetching order ${orderId}:`, error);
      throw error;
    }
  }

  async updateOrder(orderId, updateData) {
    try {
      const order = await SalesOrder.findByIdAndUpdate(
        orderId,
        { $set: updateData },
        { new: true, runValidators: true }
      );
      
      if (!order) {
        throw new Error('Order not found');
      }
      return order;
    } catch (error) {
      logger.error(`Error updating order ${orderId}:`, error);
      throw error;
    }
  }

  async deleteOrder(orderId) {
    try {
      const order = await SalesOrder.findByIdAndUpdate(
        orderId,
        { status: 'cancelled' },
        { new: true }
      );
      
      if (!order) {
        throw new Error('Order not found');
      }
      return order;
    } catch (error) {
      logger.error(`Error deleting order ${orderId}:`, error);
      throw error;
    }
  }
}

module.exports = new SalesOrderService();