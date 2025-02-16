import Mongoose from 'mongoose';

// Define the Cart schema
const cartSchema = new Mongoose.Schema(
  {
    user: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: 'User', // References the User model
      required: true,
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
          max: 10,
        },
        price: { 
          type: Number, 
          required: true 
        } // Stores the price when added to cart
      },
    ],
    totalAmount: {
      type: Number,
      min: 0, 
    },
  },
  { timestamps: true }
);

// Export the model
export const Cart= Mongoose.model("Cart",cartSchema)
