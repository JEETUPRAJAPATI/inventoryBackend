const RawMaterial = require("../../models/RawMaterial");
const logger = require("../../utils/logger");
const SalesOrder = require("../../models/SalesOrder");
const { default: mongoose } = require("mongoose");
const SubCategory = require("../../models/schemas/subCategorySchema");

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
    try {
      const { fabricColor, rollSize, gsm, fabricQuality, quantity, category } =
        req.body;

      // Validate required fields
      if (
        !fabricColor ||
        !rollSize ||
        !gsm ||
        !fabricQuality ||
        !quantity ||
        !category
      ) {
        return res.status(400).json({
          success: false,
          message: "All fields are required.",
        });
      }

      // Validate category ID format
      if (!mongoose.Types.ObjectId.isValid(category)) {
        return res.status(400).json({
          success: false,
          message: "Invalid category ID.",
        });
      }

      // Check if the parent category (RawMaterial) exists
      const rawMaterial = await RawMaterial.findById(category);
      if (!rawMaterial) {
        return res.status(404).json({
          success: false,
          message: "Parent category (RawMaterial) not found.",
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

      // Push the subcategory ID into the parent RawMaterial's subCategories array
      await RawMaterial.findByIdAndUpdate(
        category,
        { $push: { subCategories: subCategory._id } },
        { new: true }
      );

      res.status(201).json({
        success: true,
        message: "Subcategory added successfully and linked to category.",
        data: subCategory,
      });
    } catch (error) {
      logger.error("Error adding subcategory:", error);

      res.status(500).json({
        success: false,
        message: "Server error. Please try again later.",
      });
    }
  }

  async list(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * limit;

      const [materials, total] = await Promise.all([
        RawMaterial.find().populate("subCategories").skip(skip).limit(limit),
        RawMaterial.countDocuments(),
      ]);

      res.json({
        success: true,
        data: materials,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalRecords: total,
        },
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
}

module.exports = new RawMaterialController();
