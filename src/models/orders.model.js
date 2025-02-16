import  Mongoose  from 'mongoose';

// Define the Order schema
const orderSchema = new Mongoose.Schema(
  {
    user: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: 'User', // References the User model (who placed the order)
      required: true,
    },
    products: [
      {
        productId: {
          type: Mongoose.Schema.Types.ObjectId,
          ref: 'Product', // References the Product model
          required: true,
        },
        name: {
          type: String, // Stores product name at the time of ordering
          required: true,
        },
        image: {
          type: String, // Stores product image URL
        },
        quantity: {
          type: Number,
          required: true,
          min: 1, // Ensures at least 1 item is ordered
          max:10
        },
        price: {
          type: Number,
          required: true, // The price of the product at the time of ordering
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0, // Total amount of the order (shouldn't be negative)
    },
    status: {
      type: String,
      enum: ['pending', 'shipped', 'delivered', 'canceled'],
      default: 'pending', // Default status is 'pending'
    },
    shippingAddress: {
      type: String,
      required: true, // Ensures the shipping address is provided
      trim: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending', // Default payment status
    },
    paymentMethod: {
      type: String,
      enum: ['card', 'paypal', 'cash_on_delivery'],
      required: true, // Specifies how the user paid
    },
    expectedDelivery: {
      type: Date, // Expected delivery date
    }
  },
  { timestamps: true }
);

// Export the model
module.exports = Mongoose.model('Order', orderSchema);
