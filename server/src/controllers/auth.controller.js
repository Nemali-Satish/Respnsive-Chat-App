import User from "../../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

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

export const login = async (req, res) => {
  const { email, password } = req.body;

  // console.log("Login Request Body: ", req.body);

  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All Fields are Required!!!",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }
    generateToken(user._id, res);
    res.status(200).json({
      success: true,
      message: "Login Successful",
      User: user,
    });
  } catch (error) {
    console.log(`Error in Login Controller : ${error.message}`);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });

    res.status(200).json({
      success: true,
      message: "Logout Successful",
    });
  } catch (error) {
    console.log(`Error in Logout Controller : ${error.message}`);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;

    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({
        success: false,
        message: "Please provide a profile picture",
      });
    }
    const uploadRsponse = await cloudinary.uploader.upload(profilePic);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profilePic: uploadRsponse.secure_url,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      User: updatedUser,
    });
  } catch (error) {
    console.log(`Error in Update Profile Controller : ${error.message}`);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log(`Error in Check Auth Controller : ${error.message}`);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
