const SalesOrderService = require('../services/salesOrder.service');
const { salesOrderSchema } = require('../validators/salesOrder.validator');
const logger = require('../utils/logger');

class SalesOrderController {
  async createOrder(req, res) {
    try {
      const { error, value } = salesOrderSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ success: false, message: error.details[0].message });
      }

      const order = await SalesOrderService.createOrder(value);
      res.status(201).json({ success: true, data: order });
    } catch (error) {
      logger.error('Error in create order controller:', error);
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getOrders(req, res) {
    try {
      const { status, agent, page, limit } = req.query;
      const orders = await SalesOrderService.getOrders({ status, agent, page, limit });
      
      res.json({
        success: true,
        data: orders.data,
        pagination: orders.pagination
      });
    } catch (error) {
      logger.error('Error in get orders controller:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getOrderById(req, res) {
    try {
      const order = await SalesOrderService.getOrderById(req.params.id);
      res.json({ success: true, data: order });
    } catch (error) {
      logger.error('Error in get order by id controller:', error);
      res.status(404).json({ success: false, message: error.message });
    }
  }

  async updateOrder(req, res) {
    try {
      const { error, value } = salesOrderSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ success: false, message: error.details[0].message });
      }

      const order = await SalesOrderService.updateOrder(req.params.id, value);
      res.json({ success: true, data: order });
    } catch (error) {
      logger.error('Error in update order controller:', error);
      res.status(404).json({ success: false, message: error.message });
    }
  }

  async deleteOrder(req, res) {
    try {
      await SalesOrderService.deleteOrder(req.params.id);
      res.json({ success: true, message: 'Order cancelled successfully' });
    } catch (error) {
      logger.error('Error in delete order controller:', error);
      res.status(404).json({ success: false, message: error.message });
    }
  }
}

module.exports = new SalesOrderController();