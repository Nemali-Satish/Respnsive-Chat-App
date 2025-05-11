import Message from "../../models/message.model.js";
import User from "../../models/user.model.js";

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
    const { id } = req.params;
    const { message } = req.body;

    const loggedInUserId = req.user._id;

    const newMessage = await Message.create({
      sender: loggedInUserId,
      receiver: id,
      message,
    });

    res.status(200).json(newMessage);
  } catch (error) {
    console.log(`Error in Send Message Controller :- ${error.message}`);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
