import Message from "../../models/message.model.js";
import User from "../../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsers = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    // console.log("hello");

    const filtereUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    // console.log(filtereUsers);

    res.status(200).json(filtereUsers);
  } catch (error) {
    console.log(`Error in  Get Users Controller :-  ${error.message}`);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id } = req.params;
    // console.log(id);

    const loggedInUserId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: loggedInUserId, receiverId: id },
        { senderId: id, receiverId: loggedInUserId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log(`Error in Get Messages Controller :- ${error.message}`);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const { text, image } = req.body;

    const loggedInUserId = req.user._id;

    let imageUrl;
    if (image) {
      const uplloadResponse = await cloudinary.uploader.upload(image);

      imageUrl = uplloadResponse.secure_url;
    }
    const newMessage = await Message.create({
      senderId: loggedInUserId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    //Real time message

    const receiverSocketId = getReceiverSocketId(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log(`Error in Send Message Controller :- ${error.message}`);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
