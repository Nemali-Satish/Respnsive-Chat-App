import User from "../../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    console.log("Signup request:", { fullName, email, password }); // Added log

    if (!fullName || !password || !email) {
      console.log("Signup: Missing fields"); // Added log
      return res.status(400).json({
        success: false,
        message: "All Fields are Required!!!",
      });
    }

    if (password.length < 6) {
      console.log("Signup: Password too short"); // Added log
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 Characters",
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      console.log("Signup: User already exists"); // Added log
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
      console.log("Signup: User created successfully", newUser); // Added log

      res.status(201).json({
        success: true,
        message: "User Created Successfully",
        User: newUser,
      });
    } else {
      console.log("Signup: Invalid user data"); // Added log
      res.status(400).json({
        success: false,
        message: "Invalid User Data",
      });
    }
  } catch (error) {
    console.error(`Error in Sign Up Controller : ${error.message}`); // Changed to console.error
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  console.log("Login request:", { email, password }); // Added log

  try {
    if (!email || !password) {
      console.log("Login: Missing fields"); // Added log
      return res.status(400).json({
        success: false,
        message: "All Fields are Required!!!",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      console.log("Login: Invalid email"); // Added log
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Login: Invalid password"); // Added log
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }
    generateToken(user._id, res);
    console.log("Login: Login successful", user); // Added log

    res.status(200).json({
      success: true,
      message: "Login Successful",
      User: user,
    });
  } catch (error) {
    console.error(`Error in Login Controller : ${error.message}`); // Changed to console.error

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const logout = (req, res) => {
  try {
    console.log("Logout: Logging out user"); // Added log
    res.cookie("jwt", "", { maxAge: 0 });

    res.status(200).json({
      success: true,
      message: "Logout Successful",
    });
  } catch (error) {
    console.error(`Error in Logout Controller : ${error.message}`); // Changed to console.error

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    console.log("UpdateProfile request:", { profilePic }); // Added log

    const userId = req.user._id;

    if (!profilePic) {
      console.log("UpdateProfile: No profile picture provided"); // Added log
      return res.status(400).json({
        success: false,
        message: "Please provide a profile picture",
      });
    }
    const uploadRsponse = await cloudinary.uploader.upload(profilePic);
    console.log("UpdateProfile: Cloudinary response", uploadRsponse); // Added log

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profilePic: uploadRsponse.secure_url,
      },
      { new: true }
    );
    console.log("UpdateProfile: User updated", updatedUser); // Added log

    res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      User: updatedUser,
    });
  } catch (error) {
    console.error(`Error in Update Profile Controller : ${error.message}`); // Changed to console.error
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const checkAuth = (req, res) => {
  try {
    // console.log("CheckAuth: User is authenticated", req.user); // Added log
    res.status(200).json(req.user);
  } catch (error) {
    console.error(`Error in Check Auth Controller : ${error.message}`); // Changed to console.error

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
