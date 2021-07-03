const express = require("express");
const app = express();
const router = express.Router();
const User = require("../../models/UserSchema");
const Message = require("../../models/MessageSchema");
const Chat = require("../../models/ChatSchema");

app.use(express.urlencoded({ extended: false }));

router.post("/", async (req, res) => {
  if (!req.body.content || !req.body.chatId) {
    console.log("Invalid data passes ito request");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.session.user._id,
    content: req.body.content,
    chat: req.body.chatId,
  };

  Message.create(newMessage)
    .then(async (message) => {
      message = await message.populate("sender").execPopulate();
      message = await message.populate("chat").execPopulate();
      message = await User.populate(message, { path: "chat.users" });

      Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message }).catch(
        (error) => {
          console.log(error);
        }
      );

      res.status(201).send(message);
    })
    .catch((error) => {
      console.log(error);
      return res.status(400);
    });
});

module.exports = router;
