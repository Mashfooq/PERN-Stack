import dotenv from "dotenv"
import { app } from "./app"

dotenv.config({
    path: './.env'
})

console.log(process.env.PORT || 3003)

app.listen(process.env.PORT || 3002, () => console.log("Server started"))