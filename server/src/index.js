import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route.js";
import connectDB from "./lib/db.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/auth", authRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
