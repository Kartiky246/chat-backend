import { Chat } from "../models/chat.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const sendMessage = async (req, res) => {
  const loggedInUser = req.user._id;
  console.log(loggedInUser);
  try {
    const { _id, message } = req.body;
    console.log(_id, message);
    const isChatExist = await Chat.findOne({
      participants: { $all: [_id, loggedInUser] },
    });

    if (!isChatExist) {
      const chat = new Chat({
        participants: [_id, loggedInUser],
        isGroupChat: false,
        messages: [{ sender: loggedInUser, message: message }],
      });
      await chat.save();
    }

    isChatExist.messages.push({ sender: loggedInUser, message: message });
    await isChatExist.save();
    res.status(201).json(new ApiResponse(201, "Message is sent", isChatExist));
  } catch (error) {
    console.log(error, "Error in sending the message");
  }
};

export { sendMessage };
