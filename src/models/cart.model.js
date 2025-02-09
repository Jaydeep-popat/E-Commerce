import  Mongoose  from 'mongoose';

// Define the Cart schema
const cartSchema = new Mongoose.Schema(
  {
    user: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: 'User', // References the User model (who owns the cart)
      required: true,
      unique: true, // A user can only have one cart
    },
    products: [
      {
        product: {
          type: Mongoose.Schema.Types.ObjectId,
          ref: 'Product', // References the Product model
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
          max:10
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
module.exports = Mongoose.model('Cart', cartSchema);
