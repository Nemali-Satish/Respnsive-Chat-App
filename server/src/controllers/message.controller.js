import Message from "../../models/message.model.js";
import User from "../../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getUsers = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const filtereUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

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

    const loggedInUserId = req.user._id;

    const messages = await Message.find({
      $or: [
        { sender: loggedInUserId, receiver: id },
        { sender: id, receiver: loggedInUserId },
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

    res.status(201).json(newMessage);
  } catch (error) {
    console.log(`Error in Send Message Controller :- ${error.message}`);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
