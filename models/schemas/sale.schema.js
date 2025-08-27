const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending",
  },
  amount: {
    type: Number,
    required: true,
    set: (v) => parseFloat(v.toFixed(2)), // ensures 2 decimals
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

saleSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = saleSchema;
