import { Router } from "express";
import {
    addCategory,
    deleteCategory,
    updateCategory,
    getAllCategories,
    getCategoryById,
    getAllCategoriesByAdminId
    
    } from "../controllers/category.controller.js";
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.middleware.js" 



const router = new Router();


router.route("/addCategoty").post(
    verifyJWT,
    verifyAdmin,
    upload.fields([
        {
            name:"categoryImage",
            maxCount:1
        }
    ]),
    addCategory
);

router.route("/updateCategory/:_id").patch(
    verifyJWT,
    verifyAdmin,
    upload.fields([
        {
            name:"categoryImage",
            maxCount:1
        }
    ]),
    updateCategory
)

router.route("/dedeleteCategory/:_id").delete(verifyAdmin,deleteCategory)

router.route("/getAllCategories").get(verifyAdmin,getAllCategories)

router.route("/getCategoryById/:_id").get(verifyAdmin,getCategoryById)

router.route("/getAllCategoriesByAdminId/:_id").get(verifyAdmin,getAllCategoriesByAdminId)

export default router