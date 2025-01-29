const Production = require('../models/Production');
const { BAG_TYPES, OPERATOR_TYPES } = require('../config/constants');
const logger = require('../utils/logger');

class ProductionService {
  async getProduction({ bagType, operatorType, status, date, page = 1, limit = 10 }) {
    try {
      // Log request parameters for debugging
      console.log('Query Parameters:', { bagType, status, date });
      const query = {};
      if (bagType) query.bagType = bagType;
      if (operatorType) query.operatorType = operatorType;
      if (status && status !== 'all') query.status = status;
      if (date) {
        const formattedDate = new Date(date);
        console.log('Formatted Date:', formattedDate);
        query.productionDate = formattedDate;
      }
      const skip = (page - 1) * limit;
      console.log('Pagination Skip:', skip, 'Limit:', limit);

      const productions = await Production.find(query).skip(skip).limit(limit);
      const total = await Production.countDocuments(query);

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
  async getFlexoPrinting({ status, date, page = 1, limit = 10 }) {
    try {
      const query = {
        bagType: BAG_TYPES.W_CUT,
        operatorType: OPERATOR_TYPES.FLEXO_PRINTING
      };
      if (status && status !== 'all') query.status = status;
      if (date) {
        const formattedDate = new Date(date);
        query.productionDate = formattedDate;
      }
      const skip = (page - 1) * limit;

      const productions = await Production.find(query).skip(skip).limit(limit);
      const total = await Production.countDocuments(query);

      return {
        data: productions,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalRecords: total
        }
      };
    } catch (error) {
      logger.error('Error fetching Flexo Printing production:', error);
      throw error;
    }
  }

  async getBagMaking({ status, operator_name, page = 1, limit = 10 }) {
    try {
      const query = {
        bagType: BAG_TYPES.W_CUT,
        operatorType: OPERATOR_TYPES.BAG_MAKING
      };
      if (status && status !== 'all') query.status = status;
      if (operator_name) query.operatorName = operator_name;
      const skip = (page - 1) * limit;

      const productions = await Production.find(query).skip(skip).limit(limit);
      const total = await Production.countDocuments(query);

      return {
        data: productions,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalRecords: total
        }
      };
    } catch (error) {
      logger.error('Error fetching Bag Making production:', error);
      throw error;
    }
  }
}

module.exports = new ProductionService();