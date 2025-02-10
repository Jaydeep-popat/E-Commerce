import { Router } from "express";
import {
    loginUser,
    logoutUser,
    registerUser,
    getAlluser,
    updateAccountDetails,
    changeCurrentPassword,
    getCurrentUser,
    refreshAccessToken
    }from '../controllers/user.controller.js'
    
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = new Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT,logoutUser);
router.route("/getAll").get(getAlluser);
router.route("/refreshAccessToken").post(refreshAccessToken);
router.route("/getCurrentUser").get(verifyJWT,getCurrentUser);
router.route("/changeCurrentPassword").post(verifyJWT,changeCurrentPassword)
router.route("/updateAccountDetails").patch(verifyJWT,updateAccountDetails)


export default router
