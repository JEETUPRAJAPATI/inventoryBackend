const mongoose = require('mongoose');

const SubcategorySchema = new mongoose.Schema(
    {
        fabricColor: {
            type: String,
            required: true,
        },
        rollSize: {
            type: Number,
            required: true,
        },
        gsm: {
            type: Number,
            required: true,
        },
        fabricQuality: {
            type: String,
            required: false,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1, // Ensure quantity is at least 1
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category', // Assuming categories are stored in a Category model
            required: true,
        },
    },
    { timestamps: true } // Adds createdAt and updatedAt
);

const Subcategory = mongoose.model('Subcategory', SubcategorySchema);
module.exports = Subcategory;
