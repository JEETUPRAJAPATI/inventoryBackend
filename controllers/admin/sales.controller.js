const SaleService = require('../../services/sale.service');
const logger = require('../../utils/logger');

class SalesController {
  async getSales(req, res) {
    try {
      const { search, status, type, page = 1, limit = 10 } = req.query;

      const sales = await SaleService.getSales({
        search,
        status: status !== 'all' ? status : null,
        type: type !== 'all' ? type : null,
        page,
        limit,
      });

      res.json({
        success: true,
        data: sales.data,
        pagination: sales.pagination,
      });
    } catch (error) {
      logger.error('Error fetching sales:', error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}
module.exports = new SalesController();
