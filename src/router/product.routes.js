import { Router } from "express";
import {
  addProduct,
  updateProduct,
  getAllProduct,
  getProductById,
  deleteProduct,
  getProductsByCategoryId,
  getProductsByOwner,
} from "../controllers/product.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifySeller } from "../middlewares/verifySeller.middleware.js";

const router = new Router();

router.route("/addProduct").post(
  verifyJWT, // Authenticate first
  verifySeller, // Then check role
  upload.fields([{ name: "productImage", maxCount: 1 }]),
  addProduct // Controller function
);

router.route("/updateProduct").put(
    verifyJWT,
    upload.fields([{ name: "productImage", maxCount: 1 }]),
    updateProduct
  );
router.route("/getAllProduct").get(verifyJWT, getAllProduct);
router.route("/getProductById/:_id").get(verifyJWT, getProductById);
router.route("/deleteProduct/:_id").delete(verifyJWT, deleteProduct);

router
  .route("/getProductsByCategoryId/:category")
  .get(verifyJWT, getProductsByCategoryId);
router.route("/getProductsByOwner/:_id").get(verifyJWT, getProductsByOwner);

export default router;
