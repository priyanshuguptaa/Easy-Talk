const express = require("express");
const app = express();
const router = express.Router();
const middleware = require("../middleware");
const User = require("../models/UserSchema");
const Chat = require("../models/ChatSchema");
const mongoose = require("mongoose");

app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set("views", "views");

router.get("/:chatId", middleware.requireLogin, async (req, res) => {
  var userId = req.session.user._id;
  var chatId = req.params.chatId;
  var payload = {
    userLoggedInJs: JSON.stringify(req.session.user),
  };

  var chat = await Chat.findOne({
    _id: chatId,
    users: { $elemMatch: { $eq: userId } },
  }).populate("users");

  if (chat == null) {
    var userFound = await User.findById(chatId);

    if (userFound != null) {
      chat = await getChatByUserId(userFound._id, userId);
    }
  }

  if (chat == null) {
    payload.error =
      "Chat does not exist or you donot have permission to view it";
  } else {
    payload.chat = JSON.stringify(chat._id);
  }

  res.status(200).render("message", payload);
});

function getChatByUserId(userLoggedInId, otherUserId) {
  return Chat.findOneAndUpdate(
    {
      isGroupChat: false,
      users: {
        $size: 2,
        $all: [
          { $elemMatch: { $eq: mongoose.Types.ObjectId(userLoggedInId) } },
          { $elemMatch: { $eq: mongoose.Types.ObjectId(otherUserId) } },
        ],
      },
    },
    {
      $setOnInsert: {
        users: [userLoggedInId, otherUserId],
      },
    },
    {
      new: true,
      upsert: true,
    }
  ).populate("users");
}

module.exports = router;
