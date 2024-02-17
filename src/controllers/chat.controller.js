import { Chat } from "../models/chat.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const sendMessage = async (req, res) => {
  const loggedInUser = req.user._id;
  try {
    const { _id, message } = req.body;

    const isChatExist = await Chat.findOne({
      participants: { $all: [_id, loggedInUser] },
    });

    if (!isChatExist) {
      const chat = new Chat({
        participants: [_id, loggedInUser],
        isGroupChat: false,
        messages: [{ sender: loggedInUser, data: message }],
      });
      await chat.save();
    }

    isChatExist.messages.push({ sender: loggedInUser, data: message });
    await isChatExist.save();
  } catch (error) {
    console.log(error, "Error in sending the message");
  }
};

export { sendMessage };
