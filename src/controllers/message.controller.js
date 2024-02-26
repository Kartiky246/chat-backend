import { Chat } from "../models/chat.model.js";
import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;
  if (!content || !chatId) {
    return res.status(400).json(new ApiError(400, "Please provide valid data"));
  }

  const newMessage = {
    sender: req.user._id,
    message: content,
    chat: chatId,
  };

  try {
    let message = await Message.create(newMessage);

    message = await message.populate("sender", "username avatar");

    message = await message.populate("chat");

    message = await User.populate(message, {
      path: "chat.participants",
      select: "username avatar email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });

    res.status(200).json(new ApiResponse(200, "Sent", message));
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json(new ApiError(500, "Failed to send message"));
  }
};

const allMessage = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "username avatar email")
      .populate("chat");

    res.json(messages);
  } catch (error) {
    console.log(error);
  }
});

export { sendMessage, allMessage };
