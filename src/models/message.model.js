import mongoose, { Schema } from "mongoose";
const messageSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  chat: {
    type: Schema.Types.ObjectId,
    ref: "Chat",
  },
});
export const Message = mongoose.model("Message", messageSchema);
