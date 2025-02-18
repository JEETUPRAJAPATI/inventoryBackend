const ProductionService = require('../../../services/production.service');
const { BAG_TYPES, OPERATOR_TYPES } = require('../../../config/constants');
const logger = require('../../../utils/logger');

class DCutProductionController {
  async getOpsertPrinting(req, res) {
    try {
      const { status } = req.query;
      const productions = await ProductionService.getOpsertPrinting({ status });

      console.log('Calling this API:', productions);

      res.json({
        success: true,
        data: productions.data
      });
    } catch (error) {
      logger.error('Error fetching D-Cut Opsert Printing production:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getBagMaking(req, res) {
    try {
      const { status } = req.query;
      const productions = await ProductionService.getDcutBagMaking({ status });

      res.json({
        success: true,
        data: productions.data
      });
    } catch (error) {
      logger.error('Error fetching D-Cut Bag Making production:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

}

module.exports = new DCutProductionController();