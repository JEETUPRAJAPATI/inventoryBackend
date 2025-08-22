// models/Driver.js
import mongoose from "mongoose";

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  vehicleNumber: { type: String, required: true },
  contact: { type: String, required: true },
});

export default mongoose.models.Driver || mongoose.model("Driver", driverSchema);
