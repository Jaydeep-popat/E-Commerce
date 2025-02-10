import { Router } from "express";
import { addCategory } from "../controllers/category.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
const router = new Router();

router.route("/addCategoty").post(
    upload.fields([
        {
            name:"categoryImage",
            maxCount:1
        }
    ]),
    addCategory
);

export default router