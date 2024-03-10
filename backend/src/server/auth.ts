import express, { Router } from "express"
import cors from "cors";
import { api } from "./api";
import { AuthController } from "../controller/AuthController";

export const auth = Router()

auth.use(express.json())
auth.use(cors());

auth.post("/api/signIn", api.withRemult, AuthController.signInHandler);

// auth.post("/api/signOut", (req, res) => {
//   req.session.destroy(() => {
//     res.json({ message: "Signed out" });
//   });
// });

auth.get("/api/currentUser", api.withRemult, AuthController.getCurrentUser);