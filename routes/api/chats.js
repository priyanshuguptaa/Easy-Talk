const express = require("express");
const app = express();
const router = express.Router();
const User = require("../../models/UserSchema");
const Chat = require("../../models/ChatSchema");
const Message = require("../../models/MessageSchema");

app.use(express.urlencoded({ extended: false }));

router.get("/:chatId", async (req, res) => {
  var chatId = req.params.chatId;
  var chatdetails = await Chat.findById(chatId).populate("users");

  res.status(200).send(chatdetails);
});

router.post("/", async (req, res) => {
  if (!req.body.users) {
    console.log("user not send with request");
    return res.sendStatus(400);
  }

  var users = JSON.parse(req.body.users);

  if (users.length == 0) {
    console.log("Users array is empty");
    return res.sendStatus(400);
  }

  // very important code remember it
  let usersDetails = await Promise.all(
    users.map(async (username) => {
      const user = await User.find({ username: username });

      return user[0]; // important to return the value
    })
  );

  usersDetails.push(req.session.user);

  var chatData = {
    users: usersDetails,
    isGroupChat: true,
  };

  Chat.create(chatData)
    .then((results) => {
      return res.status(200).send(results);
    })
    .catch((error) => {
      console.log(`error while creating groupchat ${error} `);
      return res.sendStatus(400);
    });
});

router.get("/", async (req, res) => {
  Chat.find({ users: { $elemMatch: { $eq: req.session.user._id } } })
    .populate("users")
    .populate("latestMessage")
    .sort({ updatedAt: -1 })
    .then(async (results) => {
      results = await User.populate(results, { path: "latestMessage.sender" });
      res.status(200).send(results);
    })
    .catch((error) => {
      console.log(error);
      res.sendStatus(400);
    });
});

router.get("/:chatId/messages", async (req, res) => {
  Message.find({ chat: req.params.chatId })
    .populate("sender")
    .then((results) => res.status(200).send(results))
    .catch((error) => {
      console.log(error);
      res.sendStatus(400);
    });
});

module.exports = router;
