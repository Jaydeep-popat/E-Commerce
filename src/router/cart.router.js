import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { 
    addToCart,
    getCartItems,
    updateCartItem,
    removeCartItem,
    clearCart,
    getTotalPrice
 } from  "../controllers/cart.controller.js"


const router = new Router();

router.route("/addToCart").post(
    verifyJWT,
    addToCart
);
router.route("/getCartItems").get(
    verifyJWT,
    getCartItems
);
router.route("/updateCartItem/:productId").post(
    verifyJWT,
    updateCartItem
);
router.route("/removeCartItem/:productId").post(
    verifyJWT,
    removeCartItem
);
router.route("/clearCart").post(
    verifyJWT,
    clearCart
);
router.route("/getTotalPrice").get(
    verifyJWT,
    getTotalPrice
);

export default router