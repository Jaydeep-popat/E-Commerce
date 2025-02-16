import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
const app = express();

app.use(cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true
}))

app.use(express.json({limit: "20kb"}));
app.use(express.urlencoded({extended: true,limit:"20kb"}));
app.use(express.static("public"));
app.use(cookieParser());


import userRouter from './router/user.routes.js';
app.use("/api/users",userRouter);

import productRouter from './router/product.routes.js';
app.use("/api/products",productRouter);

import categotyRouter from './router/category.router.js';
app.use("/api/categories",categotyRouter);

import cartRouter from "./router/cart.router.js";
app.use("/api/carts",cartRouter);

import orderRouter from "./router/orders.router.js";
app.use("/api/reviews",reviewRouter);

import reviewRouter from "./router/review.router.js";
app.use("/api/orders",orderRouter);

export { app };