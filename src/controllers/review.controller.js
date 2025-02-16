import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Product } from '../models/product.model.js';
import { Review } from "../models/review.mode.js"

const createReview = asyncHandler(async (req, res) => {

    const { productId, rating, comment } = req.body;
    const userId = req.user.id;

    if (!productId || !rating) {
        throw new ApiError(400, "Product ID and rating are required");
    }

    if (rating < 1 || rating > 5) {
        throw new ApiError(400, "Rating must be between 1 and 5");
    }
    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    const existingReview = await Review.findOne({ user: userId, product: productId });

    if (existingReview) {
        throw new ApiError(409, "You have already reviewed this product");
    }

    const review = await Review.create({
        product: productId,
        user: userId,
        rating,
        comment,
    });

    const createdReview = await Review.findById(review.id);

    if (!createdReview) {
        throw new ApiError(404, "something went wrong while creating review");
    }

    return res
        .status(201)
        .json(new apiResponse(200, "review created successfully"))

})

const getProductReviews = asyncHandler(async (req, res) => {

    const { productId } = req.params;

    //  Check if the product exists
    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    const reviews = await Review.find({ product: productId })
        .populate("user", "fullName username") // Populate user details
        .sort({ createdAt: -1 }); // Sort by newest first

    return res
        .status(200)
        .json(new apiResponse(200, reviews, "Product reviews fetched successfully"));
})

const getReviewById = asyncHandler(async (req, res) => {

    const { reviewId } = req.params;

    // Find the review by ID
    const review = await Review.findById(reviewId).populate("user", "fullName username");


    if (!review) {
        throw new ApiError(404, "Review not found");
    }
    return res
        .status(200)
        .json(new apiResponse(200, review, "Review fetched successfully"));
})

const updateReview = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id; // Extracted from authentication middleware

    // 1️⃣ Find the review by ID
    const review = await Review.findById(reviewId);
    if (!review) {
        throw new ApiError(404, "Review not found");
    }

    // 2️⃣ Check if the user is the owner of the review
    if (review.user.toString() !== userId) {
        throw new ApiError(403, "You are not authorized to update this review");
    }

    // 3️⃣ Validate rating range
    if (rating && (rating < 1 || rating > 5)) {
        throw new ApiError(400, "Rating must be between 1 and 5");
    }

    if (rating) review.rating = rating;
    if (comment) review.comment = comment;

    await review.save();

    return res
        .status(200)
        .json(new apiResponse(200, review, "Review updated successfully"));

})

const deleteReview = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;
    const userId = req.user.id; // Extracted from authentication middleware
    const userRole = req.user.role; // Assuming role is available in req.user

    // 1️⃣ Find the review by ID
    const review = await Review.findById(reviewId);
    if (!review) {
        throw new ApiError(404, "Review not found");
    }

    // 2️⃣ Check if the user is the review owner or an admin
    if (review.user.toString() !== userId && userRole !== "admin") {
        throw new ApiError(403, "You are not authorized to delete this review");
    }


    // 3️⃣ Delete the review
    await review.deleteOne();

    return res
        .status(200)
        .json(new apiResponse(200, null, "Review deleted successfully"));
})

const getAllReviews = asyncHandler(async (req, res) => {

    const userRole = req.user.role; // Assuming role is available in req.user

    // 1️⃣ Check if the user is an admin
    if (userRole !== "admin") {
        throw new ApiError(403, "You are not authorized to access this resource");
    }

    const reviews = await Review.find()
        .populate("user", "fullName username") // Populate user details
        .populate("product", "name") // Populate product name
        .sort({ createdAt: -1 }); // Sort by newest first

    return res
        .status(200)
        .json(new apiResponse(200, reviews, "All reviews fetched successfully"));
})

export {
    createReview,
    getProductReviews,
    updateReview,
    deleteReview,
    getReviewById,
    getAllReviews
}