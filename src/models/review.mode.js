const mongoose = require('mongoose');

// Define the Review schema
const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product', // References the Product model
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // References the User model (who left the review)
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1, // Rating must be between 1 and 5
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Export the model
module.exports = mongoose.model('Review', reviewSchema);
