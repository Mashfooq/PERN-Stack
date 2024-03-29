import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";

import { api } from "./api";
import { auth } from "./auth";

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true
}))

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"));
app.use(cookieParser());

//routes import
import healthcheckRouter from "../routes/healthcheck.routes"
import userRouter from '../routes/user.routes'

//routes declaration
app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/v1/users", userRouter)

app.use(auth)
app.use(api)

export { app }