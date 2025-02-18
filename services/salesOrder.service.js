const SalesOrder = require('../models/SalesOrder');
const logger = require('../utils/logger');

class SalesOrderService {
  // Helper function to generate unique order ID
  generateOrderId() {
    const prefix = 'ORD';
    const uniqueId = Math.random().toString(36).substr(2, 6).toUpperCase();
    return `${prefix}-${uniqueId}`;
  }
  async createOrder(orderData) {
    try {
      const uniqueOrderId = this.generateOrderId();
      const order = new SalesOrder({
        customerName: orderData.customerName,
        email: orderData.email,
        mobileNumber: orderData.mobileNumber,
        address: orderData.address,
        orderPrice: orderData.orderPrice,
        bagDetails: {
          type: orderData.bagDetails.type, // Correct field names
          handleColor: orderData.bagDetails.handleColor,
          size: orderData.bagDetails.size,
          color: orderData.bagDetails.color,
          printColor: orderData.bagDetails.printColor,
          gsm: orderData.bagDetails.gsm
        },
        jobName: orderData.jobName,
        fabricQuality: orderData.fabricQuality,
        quantity: orderData.quantity,
        agent: orderData.agent,
        status: orderData.status || 'pending',
        orderId: uniqueOrderId
      });
      return await order.save();
    } catch (error) {
      console.error('Error creating sales order:', error);
      throw error;
    }
  }

  async getOrders({ status, agent }) {
    try {
      const query = {};
      if (status) query.status = status;
      if (agent) query.agent = agent;

      const orders = await SalesOrder.find(query);  // Removed pagination logic

      return orders;
    } catch (error) {
      logger.error('Error fetching sales orders:', error);
      throw error;
    }
  }
  async recentOrders() {
    try {
      // Fetch the 5 most recent orders, ordered by creation date
      const orders = await SalesOrder.find().sort({ createdAt: -1 }).limit(5);  // sorted by `createdAt` in descending order
      console.log('allinf');
      return orders;
    } catch (error) {
      logger.error('Error fetching recent orders:', error);
      throw error;
    }
  }


  async getOrdersList({ status, agent, type }) {
    try {
      const query = {};
      if (status) query.status = status;
      if (agent) query.agent = agent;
      if (type) query["bagDetails.type"] = type; // Ensure the type matches

      // Fetch orders and apply descending order by createdAt
      const orders = await SalesOrder.find(query).sort({ createdAt: -1 });  // Sort in descending order

      return {
        data: orders
      };
    } catch (error) {
      logger.error('Error fetching sales orders:', error);
      throw error;
    }
  }


  async getOrderById(orderId) {
    try {
      const order = await SalesOrder.findOne({ orderId: orderId });
      console.log('list our --------', order);
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
      // Find and delete the order by its ID
      const order = await SalesOrder.findByIdAndDelete(orderId);

      if (!order) {
        throw new Error('Order not found');
      }

      return order;
    } catch (error) {
      logger.error(`Error deleting order ${orderId}:`, error);
      throw error;
    }
  }
  async findOrdersByMobileNumber(mobileNumber) {
    try {
      const orders = await SalesOrder.find({ mobileNumber: mobileNumber }).select('customerName email address mobileNumber');
      return orders;
    } catch (error) {
      logger.error(`Error fetching orders by mobile number: ${mobileNumber}`, error);
      throw new Error('Error fetching orders');
    }
  }
  async findAllMobileNumbers() {
    try {
      const mobileNumbers = await SalesOrder.distinct('mobileNumber');
      return mobileNumbers;
    } catch (error) {
      logger.error('Error fetching mobile numbers:', error);
      throw new Error('Error fetching mobile numbers');
    }
  }

}

module.exports = new SalesOrderService();