import jwt from "jsonwebtoken";
import User from "../../models/user.model.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized, No Token",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRETE);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized, Invalid Token",
      });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized, User Not Found",
      });
    }
    req.user = user;

    next();
  } catch (error) {
    console.log(`Error in Auth Middleware: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
