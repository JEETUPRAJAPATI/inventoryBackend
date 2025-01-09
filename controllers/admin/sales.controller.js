const SaleService = require('../../services/sale.service');
const logger = require('../../utils/logger');

class SalesController {
  async getSales(req, res) {
    try {
      const { customer_name, status, page, limit } = req.query;
      const sales = await SaleService.getSales({ 
        customer_name, 
        status, 
        page, 
        limit 
      });
      
      res.json({
        success: true,
        data: sales.data,
        pagination: sales.pagination
      });
    } catch (error) {
      logger.error('Error fetching sales:', error);
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }
}

module.exports = new SalesController();