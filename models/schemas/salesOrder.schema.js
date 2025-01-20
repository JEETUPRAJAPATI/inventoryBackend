const salesOrderSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    mobileNumber: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true,
      trim: true
    },
    bagDetails: {
      type: {
        type: String,  // Change 'bagType' to 'type'
        required: true
      },
      handleColor: {
        type: String,
        trim: true
      },
      size: {
        type: String,
        required: true,
        trim: true
      },
      color: {
        type: String,
        trim: true
      },
      printColor: {
        type: String,
        trim: true
      },
      gsm: {
        type: Number,
        required: true,
        min: 10
      }
    },
    jobName: {
      type: String,
      required: true
    },
    fabricQuality: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    agent: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'cancelled'],
      default: 'pending'
    },
    orderId: {
      type: String,
      unique: true,
      required: true
    }
  },
  { timestamps: true } // Automatically manages createdAt and updatedAt
);

module.exports = mongoose.model('SalesOrder', salesOrderSchema);
