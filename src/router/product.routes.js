import { Router } from "express";
import {
    addProduct, 
    updateProduct, 
    getAllProduct,
    getProductById, 
    deleteProduct,
    getProductsByCategoryId,
    getProductsByUserId
} from '../controllers/product.controller.js'

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = new Router();


router.route("/addProduct").post(verifyJWT,upload.fields([{name: "productImage",maxCount: 1}]),addProduct)

router.route("/updateProduct").put(verifyJWT,upload.fields([{name: "productImage",maxCount: 1}]),updateProduct)

router.route("/getAllProduct").get(verifyJWT,getAllProduct);

router.route("/getProductById/:_id").get(verifyJWT,getProductById);

router.route("/deleteProduct/:_id").delete(verifyJWT,deleteProduct);

router.route("/getProductsByCategoryId/:_id").get(verifyJWT,getProductsByCategoryId);

router.route("/getProductsByUserId/:_id").get(verifyJWT,getProductsByUserId);

export default router