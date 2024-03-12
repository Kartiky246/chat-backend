import { Chat } from "../models/chat.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const accessChat = asyncHandler(async (req, res) => {
  const { _id } = req.body;
  if (!_id)
    return res.status(400).json(new ApiError(400, "User id is not sent"));

  let isChatExist = await Chat.findOne({
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

  if (isChatExist) {
    return res.status(200).json(new ApiResponse(200, "Success", isChatExist));
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      participants: [req.user._id, _id],
    };
  }

  try {
    const createdChat = await Chat.create(chatData);
    const completeChat = await Chat.findOne({ _id: createdChat._id }).populate(
      "participants",
      "-password"
    );
    res.status(201).json(new ApiResponse(201, "", completeChat));
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const fetchChats = asyncHandler(async (req, res) => {
  try {
    await Chat.find({
      participants: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("participants", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        console.log(results);
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "username avatar email",
        });
        res
          .status(200)
          .json(
            new ApiResponse(200, `${results?.length} Chats Found`, results)
          );
      });
  } catch (error) {
    console.log(error, "error");
  }
});

const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.participants || !req.body.name) {
    return res
      .status(400)
      .send(new ApiError(400, "Please Provide all details"));
  }
  let participants = JSON.parse(req.body.participants);
  if (participants.length < 2) {
    return res
      .status(400)
      .send(new ApiError(400, "Group should have more than 2 people"));
  }
  participants.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      participants: participants,
      isGroupChat: true,
      groupAdmin: req.user,
    });
    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("participants", "-password")
      .populate("groupAdmin", "-password");
    res
      .status(201)
      .json(
        new ApiResponse(201, "Chat is created successfully", fullGroupChat)
      );
  } catch (error) {
    console.log(error, "error");
  }
});

const changename = asyncHandler(async (req, res) => {
  const { groupId, name } = req.body;
  if ((!groupId, !name)) {
    return res
      .status(400)
      .json(new ApiError(400, "Please provide all details"));
  }
  const changednamegroup = await Chat.findByIdAndUpdate(
    groupId,
    { chatName: name },
    { new: true }
  )
    .populate("participants", "-password")
    .populate("groupAdmin", "-password");
  if (!changednamegroup) {
    return res.status(400).json(new ApiError(400, "No such chats found"));
  } else {
    return res
      .status(201)
      .json(new ApiResponse(201, "Name changed success", changednamegroup));
  }
});

const addToGroup = asyncHandler(async (req, res) => {
  const { groupId, participantId } = req.body;

  const added = await Chat.findByIdAndUpdate(
    groupId,
    {
      $push: { participants: participantId },
    },
    { new: true }
  )
    .populate("participants", "-password")
    .populate("groupAdmin", "-password");
  if (!added) {
    return res.status(400).json(new ApiError(400, "Chat is not found"));
  } else {
    return res
      .status(200)
      .json(new ApiResponse(200, "Participants added successfully", added));
  }
});

const removeFromGroup = asyncHandler(async (req, res) => {
  const { groupId, participantId } = req.body;

  const removed = await Chat.findByIdAndUpdate(
    groupId,
    {
      $pull: { participants: participantId },
    },
    { new: true }
  )
    .populate("participants", "-password")
    .populate("groupAdmin", "-password");
  if (!removed) {
    return res.status(400).json(new ApiError(400, "Chat is not found"));
  } else {
    return res
      .status(200)
      .json(new ApiResponse(200, "Participants added successfully", removed));
  }
});

export {
  accessChat,
  fetchChats,
  createGroupChat,
  changename,
  addToGroup,
  removeFromGroup,
};
