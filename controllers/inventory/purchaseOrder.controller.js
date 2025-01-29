const PurchaseOrder = require('../../models/PurchaseOrder');
const logger = require('../../utils/logger');

class PurchaseOrderController {
  async create(req, res) {
    try {
      const orderData = req.body;

      // Calculate total amount
      orderData.total_amount = orderData.quantity * orderData.unit_price;

      const order = new PurchaseOrder(orderData);
      await order.save();

      res.status(201).json({
        success: true,
        data: order
      });
    } catch (error) {
      logger.error('Error creating purchase order:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async list(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * limit;

      const [orders, total] = await Promise.all([
        PurchaseOrder.find().skip(skip).limit(limit),
        PurchaseOrder.countDocuments()
      ]);

      res.json({
        success: true,
        data: orders,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalRecords: total
        }
      });
    } catch (error) {
      logger.error('Error listing purchase orders:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const orderData = req.body;

      // Calculate updated total amount
      orderData.total_amount = orderData.quantity * orderData.unit_price;

      const updatedOrder = await PurchaseOrder.findByIdAndUpdate(id, orderData, { new: true });

      if (!updatedOrder) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      res.status(200).json({
        success: true,
        data: updatedOrder
      });
    } catch (error) {
      logger.error('Error updating purchase order:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const deletedOrder = await PurchaseOrder.findByIdAndDelete(id);

      if (!deletedOrder) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Order deleted successfully'
      });
    } catch (error) {
      logger.error('Error deleting purchase order:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new PurchaseOrderController();
