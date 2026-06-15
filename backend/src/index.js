import express from "express";

import dotenv from "dotenv";
dotenv.config()

const app = express();


const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>console.log(`Server is running on port `+ PORT));

import mongoose from "mongoose";
mongoose.connect(process.env.DB_URL, {
  dbName: "expense-tracker"
})
.then(()=>console.log("Database Connected !"))
.catch(()=>console.log("Database not connected"))

import cookieParser from "cookie-parser";
app.use(cookieParser());

import cors from 'cors'
app.use(cors({
    origin:process.env.DOMAIN,
    credentials:true
}))

//app level middleware
import morgan from "morgan";
app.use(morgan('dev'));


app.use(express.json())
app.use(express.urlencoded({extended:false}))


import userRouter from "./user/user.routes.js";
import TransactionRouter from "./transaction/transaction.route.js";
import DashboardRouter from "./dashboard/dashboard.route.js";

// route level middleware
app.use("/api/user", userRouter);

app.use("/api/transaction", TransactionRouter);     

app.use("/api/dashboard", DashboardRouter)


