import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";
import {  Category } from "../models/category.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const addCategory = asyncHandler(async (req,res)=>{

    const {name, description, userID}= req.body;

    if ([name, description,userID].some((field)=>field?.trim()==="")) {
        throw new ApiError(400, "All fields (name, description) are required.");
    }

    const existedCategory = await Category.findOne({ name, description, userID});
    
    if(existedCategory){
        throw new ApiError(409,"Category already exists");
    }
    
    const categoryImgLocatPath = req.files?.categoryImage?.[0]?.path;  

    if (!categoryImgLocatPath) {
        throw new ApiError(400, "category image is required.");
    }

    const uploadedImage = await uploadOnCloudinary(categoryImgLocatPath);
    if (!uploadedImage) {
        throw new ApiError(500, "Failed to upload product image.");
    }

    const ImageUrl = uploadedImage.url;
    console.log(ImageUrl);

    const category= await Category.create({
        name,
        description,
        createdBy:userID,
        image: ImageUrl
    })

    const createdCategory = await Category.findById(category.id);

    return res.status(201).json(new apiResponse(200, createdCategory,"category registered successfully"));
});

const updateCategory = asyncHandler(async (req, res) => {

    const { _id } = req.params;

    const { name, description } = req.body;

    console.log( _id );

    // Check if category exists
    const category = await Category.findById(_id);
    if (!category) {
        throw new ApiError(404, "Category not found.");
    }

    // Ensure at least one field is being updated
    if (![name, description].some(field => field?.trim() !== "") && !req.files?.categoryImage) {
        throw new ApiError(400, "At least one field (name, description, or image) must be updated.");
    }

    // If image is provided, upload to Cloudinary
    if (req.files?.categoryImage?.[0]?.path) {
        const uploadedImage = await uploadOnCloudinary(req.files.categoryImage[0].path);
        if (!uploadedImage) {
            throw new ApiError(500, "Failed to upload category image.");
        }
        category.image = uploadedImage.url;
    }

    // Update fields only if provided
    if (name?.trim()) category.name = name;
    if (description?.trim()) category.description = description;

    await category.save(); // Save updated category

    return res.status(200).json(new apiResponse(200, category, "Category updated successfully"));
});

const deleteCategory = asyncHandler(async (req, res) => {

    const { _id } = req.params;

    // Check if category exists
    const category = await Category.findById(_id);
    if (!category) {
        throw new ApiError(404, "Category not found.");
    }

    // Delete category
    await Category.findByIdAndDelete(_id);

    return res.status(200).json(new apiResponse(200, null, "Category deleted successfully"));
});

const getAllCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({});
    return res.status(200).json(new apiResponse(200, categories, "All categories fetched successfully"));
});

const getCategoryById = asyncHandler(async (req, res) => {

    const { _id } = req.params;

    const category = await Category.findById( _id );
    if (!category) {
        throw new ApiError(404, "Category not found.");
    }

    return res.status(200).json(new apiResponse(200, category, "Category fetched successfully"));
});

const getAllCategoriesByAdminId = asyncHandler(async (req, res) => {
    const { _id } = req.params;
    const categories = await Category.find({ _id });
    
    return res.status(200).json(new apiResponse(200, categories, "All categories fetched successfully"));
    });


export {
    addCategory,
    updateCategory,
    deleteCategory,
    getAllCategories,
    getCategoryById,
    getAllCategoriesByAdminId
}
