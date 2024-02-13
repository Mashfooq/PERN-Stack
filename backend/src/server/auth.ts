import express, { Router } from "express"
import { User } from "../shared/User"
import { remult } from "remult";

const userRepo = remult.repo(User);

export const auth = Router()

auth.use(express.json())

auth.post("/api/signIn", async (req, res) => {
  console.log("Requested")
  const { userEmail, password } = req.body;
  const user = await userRepo.findOne({ where: { userEmail: userEmail } });
  if (user && user.password === password) {
    req.session.user = user;
    res.json(user);
  } else {
    res.status(401).json({ message: "Invalid username or password" });
  }
});

auth.post("/api/signOut", (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Signed out" });
  });
});

auth.get("/api/currentUser", (req, res) => {
  res.json(req.session.user || null);
});