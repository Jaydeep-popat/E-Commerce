import { Router } from "express";
import {registrateUser} from '../controllers/user.controller.js'


const router = new Router();


router.route("/register").post(registrateUser);
export default router