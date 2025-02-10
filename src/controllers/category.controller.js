import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";
import {  Category } from "../models/category.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


const addCategory = asyncHandler(async (req,res)=>{

    const {name, description}= req.body;

    if ([name, description].some((field)=>field?.trim()==="")) {
        throw new ApiError(400, "All fields (name, description) are required.");
    }

    const existedCategory = await Category.findOne({ name, description});
    
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
        image: ImageUrl
    })

    const createdCategory = await Category.findById(category.id);

    return res.status(201).json(new apiResponse(200, createdCategory,"category registered successfully"));
});

const updateCategory = asyncHandler(async (req,res) => {
   
    const{name, description}= req.body;

    if ([name, description].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields must be filled correctly.");
    }
    
    let imageUrl = existedProduct.images;

});

export {
    addCategory
}
