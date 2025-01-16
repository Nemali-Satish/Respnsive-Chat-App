import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/connectToDb.js";
import authRoutes from "./routes/Auth.routes.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
app.use(
  cors({
    origin: [process.env.ORIGIN],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is Running at http://localhost:${PORT}`);
  connectDB();
});
