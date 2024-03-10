import express from "express"
import dotenv from "dotenv"


import { auth } from "./auth"
import { api } from "./api"

dotenv.config({
    path: '../../.env'
})

const app = express()

app.use(auth)
app.use(api)

app.listen(process.env.PORT || 3002, () => console.log("Server started"))