import  Mongoose  from 'mongoose';

// Define the Review schema
const reviewSchema = new Mongoose.Schema(
  {
    product: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: 'Product', // References the Product model
      required: true,
    },  
    user: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: 'User', // References the User model (who left the review)
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1, // Rating must be between 1 and 5
      max: 5,
      validate: {
        validator: Number.isInteger,
        message: 'Rating must be a whole number.',
      },
    },
    comment: {
      type: String,
      trim: true,
      maxlength: 255, // Fix max length property
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

// Prevent duplicate reviews from the same user on the same product
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

// Export the model
export const Review = Mongoose.model("Review",reviewSchema);
