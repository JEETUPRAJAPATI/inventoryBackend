const Sale = require('../models/Sale');
const logger = require('../utils/logger');

class SaleService {
  async getSales({ customer_name, status, page = 1, limit = 10 }) {
    try {
      const query = {};
      if (customer_name) query.customerName = new RegExp(customer_name, 'i');
      if (status) query.status = status;

      const skip = (page - 1) * limit;
      
      const [sales, total] = await Promise.all([
        Sale.find(query).skip(skip).limit(limit),
        Sale.countDocuments(query)
      ]);

      return {
        data: sales,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalRecords: total
        }
      };
    } catch (error) {
      logger.error('Error fetching sales:', error);
      throw error;
    }
  }
}

module.exports = new SaleService();