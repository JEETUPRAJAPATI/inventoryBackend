const FinishedProduct = require('../../models/FinishedProduct');
const logger = require('../../utils/logger');

const { updateFinishedProductSchema } = require('../../validators/product.validator');
class FinishedProductController {
  async create(req, res) {
    try {
      const product = new FinishedProduct(req.body);
      await product.save();

      res.status(201).json({
        success: true,
        data: product
      });
    } catch (error) {
      logger.error('Error creating finished product:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
  async update(req, res) {
    try {
      // console.log(updateFinishedProductSchema);  // Log the imported schema to verify it's not undefined
      // const { error, value } = updateFinishedProductSchema.validate(req.body);

      // if (error) {
      //   return res.status(400).json({
      //     success: false,
      //     message: error.details[0].message
      //   });
      // }

      // Find the product by ID and update it
      const product = await FinishedProduct.findByIdAndUpdate(req.params.id, req.body, { new: true });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      res.json({
        success: true,
        message: 'Product updated successfully',
        data: product
      });
    } catch (error) {
      logger.error('Error updating finished product:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }



  async list(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * limit;

      const [products, total] = await Promise.all([
        FinishedProduct.find().skip(skip).limit(limit),
        FinishedProduct.countDocuments()
      ]);

      res.json({
        success: true,
        data: products,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalRecords: total
        }
      });
    } catch (error) {
      logger.error('Error listing finished products:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async delete(req, res) {
    try {
      console.log('req.params.id', req.params.id);
      // Find and delete the finished product by its ID
      const deletedProduct = await FinishedProduct.findByIdAndDelete(req.params.id);

      if (!deletedProduct) {
        return res.status(404).json({
          success: false,
          message: 'FinishedProduct not found'
        });
      }

      res.json({
        success: true,
        message: 'FinishedProduct deleted successfully'
      });
    } catch (error) {
      logger.error('Error deleting FinishedProduct:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }


}

module.exports = new FinishedProductController();