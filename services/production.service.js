const Production = require('../models/Production');
const { BAG_TYPES, OPERATOR_TYPES } = require('../config/constants');
const logger = require('../utils/logger');

class ProductionService {
  async getProduction({ bagType, operatorType, status, date, operator_name, quantity, page = 1, limit = 10 }) {
    try {
      const query = {
        bagType,
        operatorType
      };

      if (status) query.status = status;
      if (date) query.productionDate = new Date(date);
      if (operator_name) query.operatorName = new RegExp(operator_name, 'i');
      if (quantity) query.quantity = quantity;

      const skip = (page - 1) * limit;
      
      const [productions, total] = await Promise.all([
        Production.find(query).skip(skip).limit(limit),
        Production.countDocuments(query)
      ]);

      return {
        data: productions,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalRecords: total
        }
      };
    } catch (error) {
      logger.error('Error fetching production data:', error);
      throw error;
    }
  }
}

module.exports = new ProductionService();