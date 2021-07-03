const mongoose = require("mongoose");
const User = require("./UserSchema");
const Schema = mongoose.Schema;

const chatSchema = Schema(
  {
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
    latestMessage: { type: Schema.Types.ObjectId, ref: "Message" },
    groupChatPic: {
      type: String,
      required: true,
      trim: true,
      default: "/images/groupChat.jpeg",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);
