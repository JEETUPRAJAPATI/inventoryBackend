
const ProductionManager = require('../../models/ProductionManager');
const SalesOrder = require('../../models/SalesOrder');
const Subcategory = require('../../models/subcategory');
const logger = require('../../utils/logger');
const Opsert = require('../../models/Opsert');
const DcutBagmaking = require('../../models/DcutBagmaking');
class DcutBagmakingController {
  async list(req, res) {
    try {
      // Step 1: Get all SalesOrder records with bagType "d_cut_loop_handle"
      const salesOrders = await SalesOrder.find({ "bagDetails.type": "d_cut_loop_handle" })
        .select("orderId bagDetails customerName email mobileNumber address jobName fabricQuality quantity agent status createdAt updatedAt");

      console.log('salesOrderList----', salesOrders);

      if (!salesOrders || salesOrders.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No Sales Orders found with the specified bagType"
        });
      }

      const orderIds = salesOrders.map(order => order.orderId);
      console.log('orderIds----', orderIds);

      // Step 2: Get the status from the query parameter (defaults to 'pending' if not provided)
      const statusFilter = req.query.status || "pending"; // Default to 'pending'
      const validStatuses = ["pending", "in_progress", "completed"];

      // Validate the status filter
      if (!validStatuses.includes(statusFilter)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status provided. Valid statuses are 'pending', 'in_progress', or 'completed'."
        });
      }

      // Step 3: Get ProductionManager records (no status filter applied here)
      const productionManagers = await ProductionManager.find({
        order_id: { $in: orderIds }
      });

      console.log('productionManagers----', productionManagers);

      if (!productionManagers || productionManagers.length === 0) {
        return res.status(200).json({
          success: true,
          data: [],
          message: `No active production manager orders found.`
        });
      }

      // Step 4: Get Dcutbagmaking records with status filter applied
      const DcutbagmakingRecords = await DcutBagmaking.find({
        order_id: { $in: orderIds },
        status: statusFilter // Apply status filter here
      });

      console.log('Dcutbagmaking----', DcutbagmakingRecords);

      // Step 5: Merge the data from SalesOrders, ProductionManagers, and Dcutbagmaking records
      const result = salesOrders
        .map(order => {
          const matchedProductionManagers = productionManagers.filter(pm => pm.order_id === order.orderId);
          const matchedDcutbagmaking = DcutbagmakingRecords.filter(dcut => dcut.order_id === order.orderId);

          if (matchedProductionManagers.length > 0 && matchedDcutbagmaking.length > 0) {
            return {
              ...order.toObject(),
              productionManagers: matchedProductionManagers,
              dcutbagmakingDetails: matchedDcutbagmaking
            };
          }
        })
        .filter(order => order !== undefined); // Filter out undefined entries

      console.log('Filtered result----', result);

      // Return the final result with merged data
      res.json({
        success: true,
        data: result
      });

    } catch (error) {
      console.error("Error listing D-Cut bag making entries:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching the entries. Please try again later."
      });
    }
  }



  async verifyOrder(req, res) {
    try {
      const { orderId } = req.params;

      // Fetch production details from ProductionManager
      const productionRecord = await ProductionManager.findOne({ order_id: orderId });
      if (!productionRecord) {
        return res.status(404).json({
          success: false,
          message: 'Production record not found for the given order ID.'
        });
      }
      console.log('productionRecord---------', productionRecord);

      const { roll_size, quantity_kgs } = productionRecord.production_details;

      // Fetch corresponding subcategory based on roll_size and quantity_kgs
      const matchedSubcategory = await Subcategory.findOne({ rollSize: roll_size, quantity: quantity_kgs });
      if (!matchedSubcategory) {
        return res.status(404).json({
          success: false,
          message: 'No matching subcategory found for the given production details.'
        });
      }
      console.log('matchedSubcategory---------', matchedSubcategory);

      // Fetch sales order details
      const salesOrder = await SalesOrder.findOne({ orderId: orderId });
      if (!salesOrder) {
        return res.status(404).json({
          success: false,
          message: 'Sales order not found for the given order ID.'
        });
      }
      console.log('salesOrder---------', salesOrder);

      // Extract correct fields
      const { gsm, color: fabricColor } = salesOrder.bagDetails;
      const { fabricQuality } = salesOrder;

      console.log('-----------------------------------------------');

      console.log("Matched Subcategory - GSM:", matchedSubcategory.gsm);
      console.log("Sales Order - GSM:", gsm);

      console.log("Matched Subcategory - Fabric Color:", matchedSubcategory.fabricColor);
      console.log("Sales Order - Fabric Color:", fabricColor);

      console.log("Matched Subcategory - Fabric Quality:", matchedSubcategory.fabricQuality);
      console.log("Sales Order - Fabric Quality:", fabricQuality);

      // Validate sales order details with subcategory
      if (
        matchedSubcategory.gsm === gsm &&
        matchedSubcategory.fabricColor === fabricColor &&
        matchedSubcategory.fabricQuality === fabricQuality
      ) {

        const existingRecord = await DcutBagmaking.findOne({ order_id: orderId });
        console.log("Existing DcutBagmaking Record:", existingRecord);

        if (!existingRecord) {
          console.log("No existing record in DcutBagmaking, creating a new one...");
        }

        // ✅ Update Flexo table status instead of ProductionManager
        const updateResult = await DcutBagmaking.updateOne(
          { order_id: orderId },
          {
            $set: {
              status: "in_progress"
            }
          },
          { upsert: true }
        );

        console.log("Update Result:", updateResult);
        return res.json({
          success: true,
          message: 'Order verification successful.',
          data: {
            productionDetails: productionRecord,
            subcategory: matchedSubcategory,
            salesOrder
          }
        });
      } else {
        return res.status(400).json({
          success: false,
          message: 'Order verification failed. Mismatch in sales order and subcategory details.'
        });
      }
    } catch (error) {
      console.error('Error verifying order:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async updateDcutBagMakingStatus(req, res) {
    try {
      // Log the request parameters
      console.log('req.params:', req.params);

      // Extract orderId from URL parameters and status, remarks from the request body
      const { orderId } = req.params;
      const { status, remarks } = req.body;

      // Log extracted values
      console.log('orderId:', orderId);
      console.log('status:', status);
      console.log('remarks:', remarks);

      // Define valid statuses
      const validStatuses = ["pending", "in_progress", "completed"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status provided. Valid statuses are 'pending', 'in_progress', or 'completed'."
        });
      }

      // Find and update the D-Cut Bag Making record by orderId
      const dcutBagMaking = await DcutBagmaking.findOneAndUpdate(
        { order_id: orderId },   // Find record by orderId
        {
          status: status,       // Update status
        },
        { new: true, runValidators: true } // Return the updated document
      );

      console.log('dcutBagMaking:', dcutBagMaking); // Log updated document

      // Check if the record was found
      if (!dcutBagMaking) {
        return res.status(404).json({
          success: false,
          message: `No D-Cut Bag Making record found with orderId: ${orderId}`
        });
      }

      // Return success response
      res.json({
        success: true,
        message: `D-Cut Bag Making status updated successfully to '${status}'`,
        data: dcutBagMaking
      });

    } catch (error) {
      console.error("Error updating D-Cut Bag Making status:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while updating the D-Cut Bag Making status. Please try again later."
      });
    }
  }



  async handleMoveToOpsert(req, res) {
    const { orderId } = req.params;

    try {
      // 1️⃣ Update ProductionManager progress to "D-Cut Opsert"
      const updatedProductionManager = await ProductionManager.findOneAndUpdate(
        { order_id: orderId },
        {
          $set: { "production_details.progress": "D-Cut Opsert" }
        },
        { new: true }
      );

      if (!updatedProductionManager) {
        return res.status(404).json({
          success: false,
          message: `No Production Manager record found for orderId: ${orderId}`
        });
      }

      console.log("✅ ProductionManager Updated:", updatedProductionManager);

      // 2️⃣ Update DcutBagMaking status to "opsert"
      const updatedDcutBagMaking = await DcutBagmaking.findOneAndUpdate(
        { order_id: orderId },
        {
          $set: { status: "opsert" }
        },
        { new: true }
      );

      if (!updatedDcutBagMaking) {
        return res.status(404).json({
          success: false,
          message: `No D-Cut Bag Making record found for orderId: ${orderId}`
        });
      }

      console.log("✅ DcutBagMaking Updated:", updatedDcutBagMaking);

      // 3️⃣ Insert or update Opsert table with status "pending"
      const opsertRecord = await Opsert.findOneAndUpdate(
        { order_id: orderId },
        {
          $set: { updatedAt: new Date() }, // Update `updatedAt` timestamp
          $setOnInsert: { status: "pending", createdAt: new Date() }, // Set `status` only on insert
        },
        { upsert: true, new: true }
      );

      console.log("✅ Opsert Record Created/Updated:", opsertRecord);

      return res.status(200).json({
        success: true,
        message: "Order moved to Opsert successfully.",
        data: {
          productionManager: updatedProductionManager,
          dcutBagMaking: updatedDcutBagMaking,
          opsert: opsertRecord
        }
      });

    } catch (error) {
      console.error("❌ Error in handleMoveToOpsert:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while moving the order to Opsert. Please try again."
      });
    }
  }




  async update(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Validate status transition
      if (updateData.status) {
        const currentEntry = await DcutBagmaking.findById(id);
        if (!currentEntry) {
          return res.status(404).json({
            success: false,
            message: 'D-Cut bag making entry not found'
          });
        }

        // Validate status transition
        const validTransitions = {
          pending: ['in_progress'],
          in_progress: ['completed'],
          completed: []
        };

        if (!validTransitions[currentEntry.status]?.includes(updateData.status)) {
          return res.status(400).json({
            success: false,
            message: `Invalid status transition from ${currentEntry.status} to ${updateData.status}`
          });
        }
      }

      const updatedEntry = await DcutBagmaking.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!updatedEntry) {
        return res.status(404).json({
          success: false,
          message: 'D-Cut bag making entry not found'
        });
      }

      res.json({
        success: true,
        data: updatedEntry
      });
    } catch (error) {
      logger.error('Error updating D-Cut bag making entry:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async getReport(req, res) {
    try {
      const { time_range, start_date, end_date, status } = req.query;
      const query = {};

      // Handle time range filtering
      const now = new Date();
      let startDate, endDate;

      switch (time_range) {
        case 'monthly':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          break;
        case 'weekly':
          startDate = new Date(now);
          startDate.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
          endDate = new Date(now);
          endDate.setDate(startDate.getDate() + 6); // End of week (Saturday)
          break;
        case 'yearly':
          startDate = new Date(now.getFullYear(), 0, 1);
          endDate = new Date(now.getFullYear(), 11, 31);
          break;
        case 'custom':
          if (!start_date || !end_date) {
            return res.status(400).json({
              success: false,
              message: 'start_date and end_date are required for custom time range'
            });
          }
          startDate = new Date(start_date);
          endDate = new Date(end_date);
          endDate.setHours(23, 59, 59, 999); // Include the entire end date
          break;
        default:
          // If no time_range specified, default to all-time
          break;
      }

      if (startDate && endDate) {
        query.createdAt = {
          $gte: startDate,
          $lte: endDate
        };
      }

      // Add status filter if provided
      if (status) {
        query.status = status;
      }

      // Get entries and calculate statistics
      const entries = await DcutBagmaking.find(query).sort({ createdAt: -1 });

      // Calculate statistics
      const statistics = {
        total: entries.length,
        byStatus: {
          pending: entries.filter(e => e.status === 'pending').length,
          in_progress: entries.filter(e => e.status === 'in_progress').length,
          completed: entries.filter(e => e.status === 'completed').length
        },
        totalQuantity: entries.reduce((sum, entry) => sum + entry.quantity, 0)
      };

      res.json({
        success: true,
        data: {
          entries,
          statistics,
          timeRange: {
            start: startDate || 'all-time',
            end: endDate || 'all-time'
          }
        }
      });
    } catch (error) {
      logger.error('Error generating D-Cut bag making report:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new DcutBagmakingController();