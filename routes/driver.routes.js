const express = require("express");
const router = express.Router();
const DriverController = require("../controllers/driver.controller");
const authMiddleware = require("../middleware/auth.middleware");

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Driver Routes
router.post("/create-driver", DriverController.create.bind(DriverController));
router.get("/read-driver", DriverController.list.bind(DriverController));
router.put("/update-driver/:id", DriverController.update.bind(DriverController));
router.delete("/delete-driver/:id", DriverController.delete.bind(DriverController));

module.exports = router;
