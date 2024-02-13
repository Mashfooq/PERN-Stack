import express from "express"
import session from "cookie-session"

import { auth } from "./auth"
import { api } from "./api"

const app = express()
app.use(
    session({
        secret: process.env["SESSION_SECRET"] || "my secret"
    })
)
app.use(auth)
app.use(api)

app.listen(3002, () => console.log("Server started"))