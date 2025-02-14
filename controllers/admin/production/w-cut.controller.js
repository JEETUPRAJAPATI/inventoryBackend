const ProductionService = require('../../../services/production.service');
const { BAG_TYPES, OPERATOR_TYPES } = require('../../../config/constants');
const logger = require('../../../utils/logger');

class WCutProductionController {
  async getFlexoPrinting(req, res) {
    try {
      const { status, date, page = 1, limit = 10 } = req.query;
      const productions = await ProductionService.getFlexoPrinting({
        status,
        date
      });
      console.log('production data',productions);
      res.json({
        success: true,
        data: productions.data,
        pagination: productions.pagination
      });
    } catch (error) {
      logger.error('Error fetching W-Cut Flexo Printing production:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getBagMaking(req, res) {
    try {
      const { status, operator_name, page = 1, limit = 10 } = req.query;
      const productions = await ProductionService.getBagMaking({
        status,
        operator_name,
        page,
        limit
      });

      res.json({
        success: true,
        data: productions.data,
        pagination: productions.pagination
      });
    } catch (error) {
      logger.error('Error fetching W-Cut Bag Making production:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new WCutProductionController();