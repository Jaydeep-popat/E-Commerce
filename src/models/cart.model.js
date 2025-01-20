const mongoose = require('mongoose');

// Define the Cart schema
const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // References the User model (who owns the cart)
      required: true,
      unique: true, // A user can only have one cart
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product', // References the Product model
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1, // Ensures at least 1 item is added to the cart
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0, // Total amount should not be negative
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Export the model
module.exports = mongoose.model('Cart', cartSchema);
