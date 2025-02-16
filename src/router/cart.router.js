import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addToCart } from  "../controllers/cart.controller.js"

const router = new Router();

router.route("/addToCart").post(
    verifyJWT,
    addToCart
);


export default router