
// models/Driver.js
const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema({
    name: { type: String, required: true },
    vehicleNumber: { type: String, required: true },
    contact: { type: String, required: true },
});

module.exports = mongoose.models.Driver || mongoose.model("Driver", driverSchema);
