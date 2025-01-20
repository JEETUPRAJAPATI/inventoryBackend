const ProductionManager = require('../../models/ProductionManager');
const logger = require('../../utils/logger');

class ProductionManagerController {
  // W-Cut Bagmaking Methods
  async listWCutBagmaking(req, res) {
    try {
      const { page = 1, limit = 10, status } = req.query;
      const query = { production_type: 'wcut_bagmaking' };
      
      if (status) {
        query.status = status;
      }

      const skip = (page - 1) * limit;

      const [entries, total] = await Promise.all([
        ProductionManager.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        ProductionManager.countDocuments(query)
      ]);

      res.json({
        success: true,
        data: entries,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalRecords: total
        }
      });
    } catch (error) {
      logger.error('Error listing W-Cut bagmaking entries:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async updateWCutBagmaking(req, res) {
    try {
      const { order_id } = req.params;
      const updateData = {
        production_details: req.body,
        updatedAt: new Date()
      };

      const entry = await ProductionManager.findOneAndUpdate(
        { order_id, production_type: 'wcut_bagmaking' },
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!entry) {
        return res.status(404).json({
          success: false,
          message: 'W-Cut bagmaking entry not found'
        });
      }

      res.json({
        success: true,
        data: entry
      });
    } catch (error) {
      logger.error('Error updating W-Cut bagmaking entry:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // D-Cut Bagmaking Methods
  async listDCutBagmaking(req, res) {
    try {
      const { page = 1, limit = 10, status } = req.query;
      const query = { production_type: 'dcut_bagmaking' };
      
      if (status) {
        query.status = status;
      }

      const skip = (page - 1) * limit;

      const [entries, total] = await Promise.all([
        ProductionManager.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        ProductionManager.countDocuments(query)
      ]);

      res.json({
        success: true,
        data: entries,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalRecords: total
        }
      });
    } catch (error) {
      logger.error('Error listing D-Cut bagmaking entries:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async updateDCutBagmaking(req, res) {
    try {
      const { order_id } = req.params;
      const updateData = {
        production_details: req.body,
        updatedAt: new Date()
      };

      const entry = await ProductionManager.findOneAndUpdate(
        { order_id, production_type: 'dcut_bagmaking' },
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!entry) {
        return res.status(404).json({
          success: false,
          message: 'D-Cut bagmaking entry not found'
        });
      }

      res.json({
        success: true,
        data: entry
      });
    } catch (error) {
      logger.error('Error updating D-Cut bagmaking entry:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new ProductionManagerController();