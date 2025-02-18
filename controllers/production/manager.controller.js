const ProductionManager = require('../../models/ProductionManager');
const logger = require('../../utils/logger');
const SalesOrderService = require('../../services/salesOrder.service');
const SalesOrder = require('../../models/SalesOrder');
const DcutBagmaking = require('../../models/DcutBagmaking');
const Flexo = require('../../models/Flexo');
class ProductionManagerController {
  // W-Cut Bagmaking Methods
  async listWCutBagmaking(req, res) {
    try {
      const { status, agent, page, limit } = req.query;
      const type = "w_cut_box_bag"; // Ensure type matches
      const orders = await SalesOrderService.getOrdersList({ status, agent, type });
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
    console.log('request data--------', req.body);
    try {
      const { order_id } = req.params;
      const { type } = req.body;

      // Check if the entry exists for ProductionManager with the given order_id
      let entry = await ProductionManager.findOne({ order_id });

      // If the entry exists and status is 'in_progress', do not update
      if (entry && entry.status === 'in_progress') {
        return res.status(400).json({
          success: false,
          message: 'Cannot update. The entry is in progress.',
        });
      }

      const updateData = {
        production_details: req.body,
        updatedAt: new Date(),
      };

      if (entry) {
        // Update the existing ProductionManager entry
        entry = await ProductionManager.findOneAndUpdate(
          { order_id },
          { $set: updateData },
          { new: true, runValidators: true }
        );
      } else {
        // Create a new ProductionManager entry
        entry = new ProductionManager({
          order_id,
          production_details: req.body,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        await entry.save();
      }

      // **Move Flexo and DcutBagmaking inserts here to prevent duplicates**
      if (type === 'WCut') {
        // Check if a Flexo entry already exists
        const flexoExists = await Flexo.findOne({ order_id });
        if (!flexoExists) {
          const flexoxEntry = new Flexo({
            order_id,
            status: 'pending',
            details: req.body,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          await flexoxEntry.save();
        }
      } else if (type === 'DCut') {
        // Check if a DcutBagmaking entry already exists
        const dcutExists = await DcutBagmaking.findOne({ order_id });
        if (!dcutExists) {
          const dcutEntry = new DcutBagmaking({
            order_id,
            status: 'pending',
            details: req.body,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          await dcutEntry.save();
        }
      }

      res.status(200).json({
        success: true,
        data: entry,
      });
    } catch (error) {
      console.error('Error updating or creating entry:', error);
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