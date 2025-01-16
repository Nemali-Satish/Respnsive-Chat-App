import User from "../models/User.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_SECRET, {
    expiresIn: maxAge,
  });
};

export const signUp = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const user = await User.create({ email, password });

    res.cookie("jwt", createToken(user.email, user._id), {
      maxAge: maxAge,
      secure: true,
      satisfies: "None",
    });

    return res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        profileSetUp: user.profileSetUp,
      },
    });
  } catch (error) {
    console.log(`Error in AuthController : ${error}`);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "Invalid Credentials",
      });
    }
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res.status(404).json({
        message: "Invalid Credentials",
      });
    }
    res.cookie("jwt", createToken(user.email, user._id), {
      maxAge: maxAge,
      secure: true,
      sameSite: "None",
    });

    return res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        profileSetUp: user.profileSetUp,
      },
    });
  } catch (error) {
    console.log(`Error in AuthController : ${error}`);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
export const getUserInfo = async (req, res) => {
  try {
    const userData = await User.findById(req.userId);
    if (!userData) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      id: userData._id,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      profileSetUp: userData.profileSetUp,
    });
  } catch (error) {
    console.log(`Error in AuthController : ${error}`);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};


export const updateProfile = async (req, res) => {
    try {
        const {userId} = req
        const {firstName, lastName, image} = req.body
      const userData = await User.findById(req.userId);
      if (!userData) {
        return res.status(404).json({
          message: "User not found",
        });
      }
  
      return res.status(200).json({
        id: userData._id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        image: userData.image,
        profileSetUp: userData.profileSetUp,
      });
    } catch (error) {
      console.log(`Error in AuthController : ${error}`);
      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  };
  