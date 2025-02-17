import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { 
    placeOrder,
    getOrderDetails,
    getUserOrders,
    updateOrderStatus,
    cancelOrder,
    getAllOrders
} from "../controllers/order.controller.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.middleware.js";


const router = new Router();

router.route("/placeOrder").post(
    verifyJWT,
    placeOrder
)

router.route("/getOrderDetails/:_id").get(
    verifyJWT,
    getOrderDetails
)

router.route("/getUserOrders").get(
    verifyJWT,
    getUserOrders
)

router.route("/updateOrderStatus/:_id").put(
    verifyJWT,
    verifyAdmin,
    updateOrderStatus
)

router.route("/cancelOrder/:_id").delete(
    verifyJWT,
    cancelOrder
)

router.route("/getAllOrders").get(
    verifyJWT,
    verifyAdmin,
    getAllOrders
)



export default router


