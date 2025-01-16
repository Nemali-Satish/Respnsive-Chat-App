import express from "express";
import { getUserInfo, login, signUp } from "../controllers/Auth.controller.js";
import { verifyToken } from "../middlewares/Auth.middleware.js";

const authRoutes = express.Router();

authRoutes.post("/signup", signUp);
authRoutes.post("/login", login);
authRoutes.get("/userInfo", verifyToken, getUserInfo);
authRoutes.post("/updateProfile", verifyToken, updateProfile);

export default authRoutes;
