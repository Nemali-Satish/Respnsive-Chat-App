import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  getMessages,
  getUsers,
  sendMessage,
} from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", authMiddleware, getUsers);

router.get("/:id", authMiddleware, getMessages);

router.post("/send/:id", authMiddleware, sendMessage);

export default router;
