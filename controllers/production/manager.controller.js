const ProductionManager = require('../../models/ProductionManager');
const logger = require('../../utils/logger');
const SalesOrderService = require('../../services/salesOrder.service');
const SalesOrder = require('../../models/SalesOrder');
class ProductionManagerController {
  // W-Cut Bagmaking Methods
  async listWCutBagmaking(req, res) {
    try {
      const { status, agent, page, limit } = req.query;
      const type = "w_cut_box_bag"; // Ensure type matches
      const orders = await SalesOrderService.getOrdersList({ status, agent, page, limit, type });
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

  async updateData(req, res) {
    try {
      const { order_id } = req.params;
      const updateData = {
        production_details: req.body,
        updatedAt: new Date(),
      };

      // Check if the entry exists
      const entry = await ProductionManager.findOneAndUpdate(
        { order_id },
        { $set: updateData },
        { new: true, runValidators: true }
      );

      // If the entry exists, return the updated data
      if (entry) {
        return res.json({
          success: true,
          data: entry,
        });
      }

      // If entry does not exist, create a new record
      const newEntry = new ProductionManager({
        order_id,
        production_details: req.body,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await newEntry.save();

      res.status(201).json({
        success: true,
        data: newEntry,
      });
    } catch (error) {
      logger.error('Error updating or creating W-Cut bagmaking entry:', error);
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }



  async listDCutBagmaking(req, res) {
    try {
      const { status, agent, page, limit } = req.query;
      const type = "d_cut_loop_handle"; // Ensure type matches
      const orders = await SalesOrderService.getOrdersList({ status, agent, page, limit, type });
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


  async viewOrderDetails(req, res) {
    try {
      const { order_id } = req.params;
      console.log(order_id);
      // Fetch the order details
      const order = await SalesOrderService.getOrderById(order_id);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }
      const productionManager = await ProductionManager.findOne({ order_id });
      const result = {
        order: order,
        production_manager: productionManager
      };

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error fetching order and production manager details:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getData(req, res) {
    try {
      const { order_id } = req.params;
      const productionManager = await ProductionManager.findOne({ order_id });
      res.json({
        success: true,
        data: {
          production_manager: productionManager
        }
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

}

module.exports = new ProductionManagerController();