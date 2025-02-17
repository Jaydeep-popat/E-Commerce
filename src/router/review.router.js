import { Router } from "express";
import {
    createReview,
    getProductReviews,
    updateReview,
    getReviewById,
    deleteReview,
    getAllReviews
} from "../controllers/review.controller.js";
import { verifySeller } from "../middlewares/verifySeller.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = new Router();

router.route("/createReview").post(
    verifyJWT,
    createReview
);

router.route("/getProductReviews/:productId").get(
    verifyJWT,
    getProductReviews    
);

router.route("/getReviewById/:_id").get(
    verifyJWT,
    getReviewById
)

router.route("/updateReview/:_id").post(
    verifyJWT,
    updateReview
);

router.route("/deleteReview/:_id").delete(
    verifyJWT,
    deleteReview
)

router.route("/getAllReviews").get(
    verifyJWT,
    getAllReviews
)

export default router;