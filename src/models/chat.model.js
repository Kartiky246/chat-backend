import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    data: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const chatSchema = new Schema({
  participants: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  isGroupChat: {
    type: Boolean,
    default: false,
  },
  messages: [messageSchema],
});

export const Chat = mongoose.model("Chat", chatSchema);
