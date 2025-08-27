const Driver = require("../models/Driver");
const logger = require("../utils/logger");

class DriverController {
  // Create a new driver
  async create(req, res) {
    try {
      const driver = new Driver(req.body);
      await driver.save();

      res.status(201).json({
        success: true,
        data: driver,
      });
    } catch (error) {
      logger.error("Error creating driver:", error);
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // List all drivers with pagination
  async list(req, res) {
    try {
      const drivers = await Driver.find();

      res.json({
        success: true,
        data: drivers,
      });
    } catch (error) {
      logger.error("Error listing drivers:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Update driver by ID
  async update(req, res) {
    try {
      const driver = await Driver.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true, runValidators: true }
      );

      if (!driver) {
        return res.status(404).json({
          success: false,
          message: "Driver not found",
        });
      }

      res.json({
        success: true,
        data: driver,
      });
    } catch (error) {
      logger.error("Error updating driver:", error);
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Delete driver by ID
  async delete(req, res) {
    try {
      const driver = await Driver.findByIdAndDelete(req.params.id);

      if (!driver) {
        return res.status(404).json({
          success: false,
          message: "Driver not found",
        });
      }

      res.json({
        success: true,
        message: "Driver deleted successfully",
      });
    } catch (error) {
      logger.error("Error deleting driver:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new DriverController();
