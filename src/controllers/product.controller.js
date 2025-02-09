import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Product } from "../models/product.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";

const addProduct = asyncHandler(async (req, res) => {
  const { name, description, price, stock, owner, category } = req.body;

  if (
    [name, description, price, owner, stock, category].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(
      400,
      "All fields (name, description, price, stock, owner, category) are required."
    );
  }

  const existedProduct = await Product.findOne({
    $and: [{ name }, { description }, { price }, { owner }, { category }],
  });

  if (existedProduct) {
    throw new ApiError(409, "Product with the same details already exists.");
  }

  const productImgLocalPath = req.files?.productImage?.[0]?.path;

  if (!productImgLocalPath) {
    throw new ApiError(400, "Product image is required.");
  }

  const uploadedImage = await uploadOnCloudinary(productImgLocalPath);

  if (!uploadedImage) {
    throw new ApiError(500, "Failed to upload product image.");
  }

  const imageUrl = uploadedImage.url;

  const product = await Product.create({
    name,
    description,
    images: imageUrl,
    price,
    stock,
    owner,
    category,
  });

  const createdProduct = await Product.findById(product._id);
  return res
    .status(201)
    .json(
      new apiResponse(200, createdProduct, "Product registered successfully")
    );
});

const updateProduct = asyncHandler(async (req, res) => {
  const { _id, name, description, price, stock, owner, category } = req.body;
  if (!_id) {
    throw new ApiError(409, "please provide product ID");
  }

  const existedProduct = await Product.findById(_id);

  if (!existedProduct) {
    throw new ApiError(409, "Product not found.");
  }

  if (
    [name, description, owner, category].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields must be filled correctly.");
  }

  let imageUrl = existedProduct.images;

  if (req.files?.productImage?.[0]?.path) {
    const productImgLocalPath = req.files.productImage[0].path;
    const uploadedImage = await uploadOnCloudinary(productImgLocalPath);

    if (!uploadedImage) {
      throw new ApiError(500, "Failed to upload new product image.");
    }
    imageUrl = uploadedImage.url;
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    _id,
    {
      name: name || existedProduct.name,
      description: description || existedProduct.description,
      images: imageUrl,
      price: price ?? existedProduct.price,
      stock: stock ?? existedProduct.stock,
      owner: owner || existedProduct.owner,
      category: category || existedProduct.category,
    },
    { new: true }
  );

  if (!updatedProduct) {
    throw new ApiError(404, "something went wrong while updating product.");
  }

  return res
    .status(200)
    .json(
      new apiResponse(200, updatedProduct, "Product updated successfully.")
    );
});

const getAllProduct = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  return res
    .status(200)
    .json(new apiResponse(200, products, "All products fetched successfully."));
});

const getProductById = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  if (!_id) {
    throw new ApiError(409, "Please provide product _ID");
  }

  const product = await Product.findById(_id);

  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  return res
    .status(200)
    .json(new apiResponse(200, product, "Product fetched successfully."));
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { _id } = req.params;


  if (!_id) {
    throw new ApiError(409, "Please provide product _ID");
  }

  const deletedProduct = await Product.findByIdAndDelete(_id);

  if (!deletedProduct) {
    throw new ApiError(404, "Product not found.");
  }
  return res
    .status(200)
    .json(
      new apiResponse(200, deletedProduct, "Product deleted successfully.")
    );
});

const getProductsByCategoryId = asyncHandler(async (req, res) => {

  const { categoryId } = req.params;

  if(!categoryId) {
    throw new ApiError(409, "Please provide category ID");
  }
  const products = await Product.find({ categoryId });
  return res
   .status(200)
   .json(new apiResponse(200, products, "Products fetched successfully."));
})

const getProductsByUserId = asyncHandler(async (req, res) => {

  const { _id } = req.params;

  
  if(!_id){
    throw new ApiError(409, "Please provide user ID");
  }

  const products = await Product.find({ _id });
  return res
  .status(200)
  .json(new apiResponse(200, products, "Products fetched successfully."));
})

export { 
  addProduct, 
  updateProduct, 
  getAllProduct, 
  getProductById,
  deleteProduct,
  getProductsByCategoryId,
  getProductsByUserId
};