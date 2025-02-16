import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";

const addToCart = asyncHandler(async (req, res) => {

    const { userId, productId, quantity } = req.body;
    const parsedQuantity = Number(quantity); // Convert to number from string (default)


    //throw error if prorer infromance is not provided 
    if (!userId) {
        throw new ApiError(400, "userId is required.");
    }
    if (!productId) {
        throw new ApiError(400, "productId is required.");
    }
    if (!quantity) {
        throw new ApiError(400, "quantity is required.");
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    // Check if product is already in cart
    const cart = await Cart.findOne({ user: userId });

    if (cart) {
        // Check if product exists in cart
        const existingProduct = cart.products.find((item) =>
            item.product.equals(productId)
        );

        if (existingProduct) {
            // Ensure quantity does not exceed max limit
            if (existingProduct.quantity + parsedQuantity > 10) {
                throw new ApiError(400, "Quantity exceeds the maximum limit (10)");
            }

            existingProduct.quantity += parsedQuantity; // ✅ Fix: Ensure proper addition
        } else {
            // Add new product to cart
            cart.products.push({
                product: productId,
                quantity,
                price: product.price, // Store price at the time of adding
            });
        }

        // Recalculate total amount
        cart.totalAmount = cart.products.reduce(
            (total, item) => total + item.quantity * item.price,
            0
        );

        await cart.save();
        return res
            .status(200)
            .json(new apiResponse(200, cart, "Cart updated successfully"));
    } else {
        // Create new cart if none exists for user
        const newCart = await Cart.create({
            user: userId,
            products: [{ product: productId, quantity, price: product.price }],
            totalAmount: product.price * quantity,
        });
        return res
            .status(201)
            .json(new apiResponse(201, newCart, "Product added to cart"));
    }
});

const getCartItems = asyncHandler(async (req, res) => {

    const { userId } = req.params;

    if (!userId) {
        throw new ApiError(400, "User ID is required");
    }
    // Find cart for the user and populate product details
    const cart = await Cart.findOne({ user: userId }).populate(
        "products.product",
        "name price image"
    );

    if (!cart || cart.products.length === 0) {
        throw new ApiError(404, "Cart is empty");
    }
    return res
        .status(200)
        .json(new apiResponse(200, cart, "Cart items fetched successfully"));

})

const updateCartItem = asyncHandler(async (req, res) => {
    const { userId, productId } = req.params;
    const { quantity } = req.body;
    const parsedQuantity = Number(quantity); // Convert to number

    if (!userId || !productId || !parsedQuantity) {
        throw new ApiError(400, "User ID, Product ID, and valid quantity are required");
    }

    if (parsedQuantity < 1 || parsedQuantity > 10) {
        throw new ApiError(400, "Quantity must be between 1 and 10");
    }

    // Find cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
        throw new ApiError(404, "Cart not found");
    }

    // Find product in cart
    const existingProduct = cart.products.find((item) =>
        item.product.equals(productId)
    );

    if (!existingProduct) {
        throw new ApiError(404, "Product not found in cart");
    }

    // Update quantity
    existingProduct.quantity = parsedQuantity;

    // Recalculate total amount
    cart.totalAmount = cart.products.reduce(
        (total, item) => total + item.quantity * item.price,0
    );
    await cart.save();

    return res
        .status(200)
        .json(new apiResponse(200, cart, "Cart item quantity updated successfully"));
});

const removeCartItem = asyncHandler(async (req, res) => {
    const { userId, productId } = req.params;
  
    if (!userId || !productId) {
      throw new ApiError(400, "User ID and Product ID are required");
    }
  
    // Find cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      throw new ApiError(404, "Cart not found");
    }
  
    // Find product in cart
    const productIndex = cart.products.findIndex((item) =>
      item.product.equals(productId)
    );
  
    if (productIndex === -1) {
      throw new ApiError(404, "Product not found in cart");
    }
  
    // Remove product from cart
    cart.products.splice(productIndex, 1);
  
    // Recalculate total amount
    cart.totalAmount = cart.products.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );
  
    // If cart is empty after removal, you can either:
    if (cart.products.length === 0) {
      await Cart.findOneAndDelete({ user: userId }); // ❌ Delete the cart if empty
      return res
        .status(200)
        .json(new apiResponse(200, {}, "Cart is now empty and deleted"));
    }
  
    await cart.save();
    return res
      .status(200)
      .json(new apiResponse(200, cart, "Cart item removed successfully"));
  });
  
  const clearCart = asyncHandler(async (req, res) => {
    const { userId } = req.params;
  
    if (!userId) {
      throw new ApiError(400, "User ID is required");
    }
  
    // Find cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      throw new ApiError(404, "Cart not found");
    }
  
    // Empty the cart but keep it
    cart.products = [];
    cart.totalAmount = 0;
    await cart.save();
  
    return res
      .status(200)
      .json(new apiResponse(200, cart, "Cart cleared successfully"));
  });

  const getTotalPrice = asyncHandler(async (req, res) => {
    const { userId } = req.params;
  
    if (!userId) {
      throw new ApiError(400, "User ID is required");
    }
  
    // Find cart
    const cart = await Cart.findOne({ user: userId }).populate("products.product", "price");
    if (!cart) {
      throw new ApiError(404, "Cart not found");
    }
  
    // Calculate total price dynamically
    const totalPrice = cart.products.reduce(
      (total, item) => total + item.quantity * item.product.price,
      0
    );
  
    return res
      .status(200)
      .json(new apiResponse(200, { totalPrice }, "Total cart price calculated successfully"));
  });

export {
    addToCart,
    getCartItems,
    updateCartItem,
    removeCartItem,
    clearCart,
    getTotalPrice
}