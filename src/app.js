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



// all imports
import userRouter from './router/user.routes.js';
import productRouter from './router/product.routes.js';
import categotyRouter from './router/category.router.js';
import cartRouter from "./router/category.router.js";
import orderRouter from "./router/orders.router.js";
import reviewRouter from "./router/review.router.js";


// all routes
app.use("/api/users",userRouter);
app.use("/api/products",productRouter);
app.use("/api/categories",categotyRouter);
app.use("/api/carts",cartRouter);
app.use("/api/reviews",reviewRouter);
app.use("/api/orders",orderRouter);

export { app };