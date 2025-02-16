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


//testing of this API is not yet implemented
router.route("getReviewById/:reviewId").get(
    verifyJWT,
    getReviewById
)

router.route("/updateReview/:reviewId").post(
    verifyJWT,
    updateReview
);

router.route("/deleteReview/:reviewId").post(
    verifyJWT,
    deleteReview
)

router.route("/getAllReviews").get(
    verifyJWT,
    getAllReviews
)

export default router;