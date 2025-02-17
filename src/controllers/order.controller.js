import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Order } from "../models/orders.model.js";
import { Cart } from "../models/cart.model.js";


const placeOrder = asyncHandler(async (req, res) => {

  const userId = req.user.id;
  const { shippingAddress, paymentMethod } = req.body;

  if (!userId || !shippingAddress || !paymentMethod) {
    throw new ApiError(400, "User ID, shipping address, and payment method are required");
  }

  // Fetch user's cart
  const cart = await Cart.findOne({ user: userId }).populate("products.product", "name price image");

  if (!cart || cart.products.length === 0) {
    throw new ApiError(404, "Cart is empty. Cannot place an order.");
  }

  // Extract product details from the cart
  const products = cart.products.map((item) => ({
    productId: item.product._id,
    name: item.product.name,
    image: item.product.image,
    quantity: item.quantity,
    price: item.product.price,
  }));

  // Calculate total order amount
  const totalAmount = products.reduce((total, item) => total + item.quantity * item.price, 0);

  // Create the order
  const ordered = await Order.create({
    user: userId,
    products,
    totalAmount,
    shippingAddress,
    paymentMethod,
    paymentStatus: "pending",
    status: "pending",
    expectedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  });

  if (!ordered) {
    throw new ApiError(500, "Failed to create order");
  }

  // Clear the user's cart after successful order placement
  await Cart.findOneAndDelete({ user: userId });

  return res
    .status(201)
    .json(new apiResponse(201, ordered, "Order placed successfully"));
});
const getOrderDetails = asyncHandler(async (req, res) => {

  const { _id } = req.params;

  if (!_id) {
    throw new ApiError(400, "Order ID is required");
  }

  // Find the order and populate user & product details
  const order = await Order.findById(_id)
    .populate("user", "fullName email")
    .populate("products.productId", "name image price");

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  return res
    .status(200)
    .json(new apiResponse(200, order, "Order details fetched successfully"));
});
const getUserOrders = asyncHandler(async (req, res) => {

  const userId = req.user.id;

  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }

  // Fetch orders for the user, sorted by latest first
  const orders = await Order.find({ user: userId })
    .populate("products.productId", "name image price")
    .sort({ createdAt: -1 });

  if (!orders.length) {
    throw new ApiError(404, "No orders found for this user");
  }

  return res
    .status(200)
    .json(new apiResponse(200, orders, "User's order history fetched successfully"));
});
const updateOrderStatus = asyncHandler(async (req, res) => {

  const { _id } = req.params;
  const { status } = req.body;

  const validStatuses = ["pending", "shipped", "delivered", "canceled"];

  if (!_id || !status) {
    throw new ApiError(400, "Order ID and status are required");
  }

  if (!validStatuses.includes(status)) {
    throw new ApiError(400, "Invalid status value");
  }

  // Find and update order
  const order = await Order.findById(_id);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (order.status === "delivered") {
    throw new ApiError(400, "Delivered orders cannot be updated");
  }

  order.status = status;
  await order.save();

  return res
    .status(200)
    .json(new apiResponse(200, order, "Order status updated successfully"));
});
const cancelOrder = asyncHandler(async (req, res) => {
  const { _id } = req.params;

  if (!_id) {
    throw new ApiError(400, "Order ID is required");
  }

  // Find the order
  const order = await Order.findById(_id);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  console.log(order.status);
  
  // Prevent canceling delivered or already canceled orders
  if (order.status === "delivered" || order.status === "canceled") {
    throw new ApiError(400, "Delivered or already canceled orders cannot be canceled");
  }

  // Update status to 'canceled'
  order.status = "canceled";
  await order.save();

  return res
    .status(200)
    .json(new apiResponse(200, order, "Order canceled successfully"));
});

const getAllOrders = asyncHandler(async (req, res) => {

  // Fetch all orders with pagination
  const orders = await Order.find({})
    .populate("user", "fullName email")
    .populate("products.productId", "name image price")
    .sort({ createdAt: -1 })  

  if (!orders.length) {
    throw new ApiError(404, "No orders found");
  }

  return res
    .status(200)
    .json(new apiResponse(200, orders, "All orders fetched successfully"));
});

export {
  placeOrder,
  getOrderDetails,
  getUserOrders,
  updateOrderStatus,
  cancelOrder,
  getAllOrders
}