import { Chat } from "../models/chat.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const accessChat = asyncHandler(async (req, res) => {
  const { _id } = req.body;
  if (!_id)
    return res.status(400).json(new ApiError(400, "User id is not sent"));

  let isChatExist = await Chat.find({
    isGroupChat: false,
    $and: [
      { participants: { $elemMatch: { $eq: req.user._id } } },
      { participants: { $elemMatch: { $eq: _id } } },
    ],
  })
    .populate("participants", "-password")
    .populate("latestMessage");

  isChatExist = await User.populate(isChatExist, {
    path: "latestMessage.sender",
    sender: "username avatar email",
  });

  if (isChatExist.length > 0) {
    res.status(201).json(new ApiResponse(201, "Success", isChatExist[0]));
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, _id],
    };
  }

  try {
    const createdChat = await Chat.create(chatData);
    const completeChat = await Chat.findOne({ _id: createdChat._id }).populate(
      "participants",
      "-password"
    );
    res.status(200).json(new ApiResponse(200, "", completeChat));
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

export { accessChat };
