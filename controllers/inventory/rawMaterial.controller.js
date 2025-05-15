const RawMaterial = require("../../models/RawMaterial");
const logger = require("../../utils/logger");
const SalesOrder = require("../../models/SalesOrder");
const { default: mongoose } = require("mongoose");
const SubCategory = require("../../models/schemas/subCategorySchema");
const Subcategory = require("../../models/subcategory");
const Delivery = require("../../models/Delivery");
const User = require("../../models/User");
const ProductionManager = require("../../models/ProductionManager");

class RawMaterialController {
  async create(req, res) {
    try {
      const user = req.user;

      // Destructure request body to extract raw material details
      const {
        category_name,
        fabric_quality,
        roll_size,
        gsm,
        fabric_color,
        quantity_kgs,
      } = req.body;

      // Validate required fields
      if (
        !category_name ||
        !fabric_quality ||
        !roll_size ||
        !gsm ||
        !fabric_color ||
        !quantity_kgs
      ) {
        return res.status(400).json({
          success: false,
          message: "All fields are required.",
        });
      }

      // Create new raw material instance
      const rawMaterial = await RawMaterial.create({
        category_name,
        fabric_quality,
        roll_size,
        gsm,
        fabric_color,
        quantity_kgs,
      });

      // if (!mongoose.Types.ObjectId.isValid(user._id)) {
      //   return res.status(400).json({
      //     success: false,
      //     message: "Invalid user ID.",
      //   });
      // }

      // const updatedSalesOrder = await SalesOrder.findOneAndUpdate(
      //   { userId: user._id },
      //   {
      //     $push: { category: rawMaterial._id },
      //   },
      //   { new: true }
      // ).populate("category");

      // if (!updatedSalesOrder) {
      //   return res.status(404).json({
      //     success: false,
      //     message: "Sales order not found for this user.",
      //   });
      // }

      res.status(201).json({
        success: true,
        data: rawMaterial,
      });
    } catch (error) {
      logger.error("Error creating raw material:", error);

      if (error.name === "ValidationError") {
        return res.status(400).json({
          success: false,
          message: "Validation Error",
          errors: error.errors, // Detailed validation errors
        });
      }

      res.status(500).json({
        success: false,
        message: "Server error. Please try again later.",
      });
    }
  }

  async createSubCategory(req, res) {
    console.log('req.body', req.body);

    try {
      // Destructure request body
      let { fabricColor, rollSize, gsm, fabricQuality, quantity, category } = req.body;

      // Convert rollSize, gsm, and quantity to numbers
      rollSize = Number(rollSize);
      gsm = Number(gsm);
      quantity = Number(quantity);

      // Validate required fields
      // if (!fabricColor || isNaN(rollSize) || isNaN(gsm) || !fabricQuality || isNaN(quantity) || !category) {
      //   return res.status(400).json({
      //     success: false,
      //     message: "All fields are required and must be valid numbers.",
      //   });
      // }

      // Validate category ID format
      if (!mongoose.Types.ObjectId.isValid(category)) {
        return res.status(400).json({
          success: false,
          message: "Invalid category ID.",
        });
      }

      // Fetch RawMaterial data
      const rawMaterial = await RawMaterial.findById(category);
      if (!rawMaterial) {
        return res.status(404).json({
          success: false,
          message: "Parent category (RawMaterial) not found.",
        });
      }

      console.log('RawMaterial before update:', rawMaterial);

      // Check if stock is sufficient before subtraction
      if (
        rawMaterial.quantity_kgs < quantity
      ) {
        return res.status(404).json({
          success: false,
          message: "Insufficient stock in inventory. Unable to add subcategory due to low raw material availability.",
        });
      }
      // Create the subcategory
      const subCategory = await SubCategory.create({
        fabricColor,
        rollSize,
        gsm,
        fabricQuality,
        quantity,
        category,
      });

      // Subtract values from RawMaterial
      rawMaterial.quantity_kgs -= quantity;

      // Save updated RawMaterial
      await rawMaterial.save();

      res.status(201).json({
        success: true,
        message: "Subcategory added successfully and inventory updated.",
        data: subCategory,
        updatedRawMaterial: rawMaterial,
      });

    } catch (error) {
      console.error("Error adding subcategory:", error);
      res.status(500).json({
        success: false,
        message: "Server error. Please try again later.",
      });
    }
  }


  async list(req, res) {
    try {
      const materials = await RawMaterial.find().sort({ _id: -1 }).populate("subCategories");

      res.json({
        success: true,
        data: materials,
      });
    } catch (error) {
      logger.error("Error listing raw materials:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }


  async getSubcategories(req, res) {
    try {
      const { categoryId } = req.params;

      // Validate Category ID
      const category = await RawMaterial.findById(categoryId);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }

      // Fetch Subcategories linked to this Category
      const subCategories = await SubCategory.find({
        category: categoryId,
        status: 'active'
      }).populate("category");

      res.status(200).json({
        success: true,
        data: subCategories,
      });
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      res.status(500).json({
        success: false,
        message: "Server error. Please try again later.",
      });
    }
  }

  async update(req, res) {
    try {
      const material = await RawMaterial.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

      if (!material) {
        return res.status(404).json({
          success: false,
          message: "Raw material not found",
        });
      }

      res.json({
        success: true,
        data: material,
      });
    } catch (error) {
      logger.error("Error updating raw material:", error);
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async deleteMaterial(req, res) {
    try {
      const { id } = req.params;

      // Validate ObjectId format
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid material ID.",
        });
      }

      // Find and delete the raw material
      const material = await RawMaterial.findByIdAndDelete(id);

      if (!material) {
        return res.status(404).json({
          success: false,
          message: "Raw material not found.",
        });
      }

      res.json({
        success: true,
        message: "Raw material deleted successfully.",
        data: material,
      });
    } catch (error) {
      logger.error("Error deleting raw material:", error);

      res.status(500).json({
        success: false,
        message: "Server error. Please try again later.",
      });
    }
  }

  async deleteSubCategory(req, res) {
    try {
      const { id } = req.params;
      console.log("Subcategory ID received:", id);

      // Validate ObjectId format
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid subcategory ID format.",
        });
      }

      // Find and delete the subcategory
      const subcategory = await Subcategory.findByIdAndDelete(id);

      if (!subcategory) {
        return res.status(404).json({
          success: false,
          message: "Subcategory not found or already deleted.",
        });
      }

      res.json({
        success: true,
        message: "Subcategory deleted successfully.",
        deletedSubcategory: subcategory,
      });
    } catch (error) {
      console.error("Error deleting subcategory:", error); // Use console.error for better debugging
      logger.error("Error deleting subcategory:", error);

      res.status(500).json({
        success: false,
        message: "Internal server error. Please try again later.",
      });
    }
  }

  async recentActivities(req, res) {
    try {
      const latestSalesOrder = await SalesOrder.findOne().sort({ createdAt: -1 });
      const latestDelivery = await Delivery.findOne().sort({ createdAt: -1 });
      const latestUser = await User.findOne().sort({ createdAt: -1 });
      const latestProductionTask = await ProductionManager.findOne().sort({ createdAt: -1 });

      const activities = [];

      if (latestSalesOrder) {
        activities.push({
          id: latestSalesOrder._id,
          type: "order",
          text: `New order #${latestSalesOrder.orderId} received`,
          time: latestSalesOrder.createdAt,
        });
      }

      if (latestDelivery) {
        activities.push({
          id: latestDelivery._id,
          type: "delivery",
          text: `Order #${latestDelivery.orderId} has been delivered`,
          time: latestDelivery.createdAt,
        });
      }

      if (latestUser) {
        activities.push({
          id: latestUser._id,
          type: "user",
          text: `New user ${latestUser.fullName} registered`,
          time: latestUser.createdAt,
        });
      }

      if (latestProductionTask) {
        activities.push({
          id: latestProductionTask._id,
          type: "task",
          text: `Production task ${latestProductionTask.order_id} completed`,
          time: latestProductionTask.createdAt,
        });
      }

      return res.status(200).json({
        success: true,
        data: activities.sort((a, b) => new Date(b.time) - new Date(a.time)), // Sort by latest timestamp
      });

    } catch (error) {
      console.error("Error fetching recent activities:", error);
      return res.status(500).json({
        success: false,
        message: "Error fetching recent activities",
      });
    }
  }
}

module.exports = new RawMaterialController();
