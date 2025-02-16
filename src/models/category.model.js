import  Mongoose  from 'mongoose';

// Define the Category schema
const categorySchema = new Mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true, // Each category name should be unique
    },
    createdBy:{
      type: Mongoose.Schema.Types.ObjectId,
      ref: 'User', // References the User model
      required: true,  // Each category belongs to a user
    },
    description: {
      type: String,
      trim: true,
      max: 255
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    image:
      {
        type: String, // URLs for product images
        required: true,
      },
  },
  { timestamps: true }
);

// Export the model
export const Category = Mongoose.model("Category", categorySchema );
