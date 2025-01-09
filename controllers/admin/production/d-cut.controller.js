const ProductionService = require('../../../services/production.service');
const { BAG_TYPES, OPERATOR_TYPES } = require('../../../config/constants');
const logger = require('../../../utils/logger');

class DCutProductionController {
  async getOpsertPrinting(req, res) {
    try {
      const { status, date, page, limit } = req.query;
      const productions = await ProductionService.getProduction({
        bagType: BAG_TYPES.D_CUT,
        operatorType: OPERATOR_TYPES.OPSERT_PRINTING,
        status,
        date,
        page,
        limit
      });

      res.json({
        success: true,
        data: productions.data,
        pagination: productions.pagination
      });
    } catch (error) {
      logger.error('Error fetching D-Cut Opsert Printing production:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getBagMaking(req, res) {
    try {
      const { operator_name, quantity, page, limit } = req.query;
      const productions = await ProductionService.getProduction({
        bagType: BAG_TYPES.D_CUT,
        operatorType: OPERATOR_TYPES.BAG_MAKING,
        operator_name,
        quantity,
        page,
        limit
      });

      res.json({
        success: true,
        data: productions.data,
        pagination: productions.pagination
      });
    } catch (error) {
      logger.error('Error fetching D-Cut Bag Making production:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new DCutProductionController();