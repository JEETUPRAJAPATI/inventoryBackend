const mongoose = require("mongoose");

// Counter schema to track incremental numbers
const counterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  seq: { type: Number, default: 0 }
});

const Counter = mongoose.model("Counter", counterSchema);

const SubCategorySchema = new mongoose.Schema(
  {
    shortId: {
      type: String,
      unique: true
    },
    fabricColor: {
      type: String,
      required: [true, "Fabric color is required"],
      trim: true,
    },
    rollSize: {
      type: Number,
      required: [true, "Roll size is required"],
      min: [1, "Roll size must be at least 1"],
    },
    gsm: {
      type: Number,
      required: [true, "GSM is required"],
      min: [1, "GSM must be at least 1"],
    },
    fabricQuality: {
      type: String,
      required: [true, "Fabric quality is required"],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RawMaterial",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    is_used: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Pre-save hook to generate incremental shortId
SubCategorySchema.pre("save", async function (next) {
  if (this.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { name: "subcategory" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    // Generate ID like TIPLM001, TIPLM002 ...
    this.shortId = "TIPLM" + counter.seq.toString().padStart(3, "0");
  }
  next();
});

module.exports = mongoose.model("SubCategory", SubCategorySchema);
