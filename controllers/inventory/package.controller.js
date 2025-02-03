const Package = require('../../models/Package');
const mongoose = require('mongoose');
const logger = require('../../utils/logger');
const SalesOrder = require('../../models/SalesOrder');

class PackageController {
  async create(req, res) {
    try {
      const pkg = new Package(req.body);
      await pkg.save();

      res.status(201).json({
        success: true,
        data: pkg
      });
    } catch (error) {
      logger.error('Error creating package:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
  async createPackage(req, res) {
    try {
      const { order_id, package_details } = req.body;

      // Validate required fields
      if (!order_id || !Array.isArray(package_details) || package_details.length === 0) {
        return res.status(400).json({
          success: false,
          message: "order_id and package_details (non-empty array) are required."
        });
      }

      // Validate each package detail
      for (const pkg of package_details) {
        if (
          typeof pkg.length !== "number" ||
          typeof pkg.width !== "number" ||
          typeof pkg.height !== "number" ||
          typeof pkg.weight !== "number"
        ) {
          return res.status(400).json({
            success: false,
            message: "Each package detail must have numeric length, width, height, and weight."
          });
        }
      }

      // Find the existing package by order_id
      let existingPackage = await Package.findOne({ order_id });

      if (existingPackage) {
        // Append new package_details to the existing package
        existingPackage.package_details.push(...package_details);
        existingPackage.updatedAt = new Date();
        await existingPackage.save();

        return res.status(200).json({
          success: true,
          message: "Package details updated successfully.",
          data: existingPackage
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "Order ID not found. Cannot add package details."
        });
      }
    } catch (error) {
      logger.error(`Error updating package: ${error.message}`, error);
      res.status(500).json({
        success: false,
        message: "Failed to update package details.",
        error: error.message
      });
    }
  }



  async getOrders(req, res) {
    try {
      // Fetch all orders with the status 'pending'
      const orders = await SalesOrder.find(
        { status: 'pending' }
      );
      res.json({
        success: true,
        data: orders,
      });
    } catch (error) {
      logger.error('Error in getOrders controller:', error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }



  async getByOrderId(req, res) {
    try {
      console.log('listing data', req.params.orderId);
      const packages = await Package.find({ order_id: req.params.orderId });
      console.log('package listing', packages);
      res.json({
        success: true,
        data: packages
      });
    } catch (error) {
      logger.error('Error getting packages by order ID:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async update(req, res) {
    try {
      const { orderId, packageId } = req.params;
      const updateData = req.body;

      // Find the package document by order ID
      const pkg = await Package.findOne({
        order_id: orderId,
        'package_details._id': packageId
      });

      if (!pkg) {
        return res.status(404).json({
          success: false,
          message: 'Package not found for this order'
        });
      }

      // Find and update the specific package details
      const packageDetail = pkg.package_details.id(packageId);
      if (!packageDetail) {
        return res.status(404).json({
          success: false,
          message: 'Package ID not found in this order'
        });
      }

      // Update the package details
      Object.assign(packageDetail, updateData);

      // Save the updated document
      await pkg.save();

      res.json({
        success: true,
        data: pkg
      });
    } catch (error) {
      logger.error('Error updating package:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new PackageController();