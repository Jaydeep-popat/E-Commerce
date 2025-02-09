import  Mongoose  from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Define the Product schema
const productSchema = new Mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    description: {
      type: String,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      default:0,
      min: 0, // Price can't be negative
    },
    owner: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'User', // References the User model (the user who uploaded the product)
        required: true,
    },
    category: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'Category', // References the Category model
        required: true,
    },
    stock:{
      type: Number,
      required: true,
      min: 0, // Stock can't be negative
    },
    images: [
      {
        type: String, // URLs for product images
        required: true,
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
); 

// Export the model
export const Product = Mongoose.model("Product",productSchema);
