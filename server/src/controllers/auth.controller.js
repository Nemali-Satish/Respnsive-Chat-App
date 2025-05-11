import User from "../../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !password || !email) {
      return res.status(400).json({
        success: false,
        message: "All Fields are Required!!!",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 Characters",
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exists!!",
      });
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        success: true,
        message: "User Created Successfully",
        User: newUser,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid User Data",
      });
    }
  } catch (error) {
    console.log(`Error in Sign Up Controller : ${error.message}`);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const login = (req, res) => {};

export const logout = (req, res) => {};
