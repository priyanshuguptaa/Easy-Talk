const express = require("express");
const app = express();
const router = express.Router();
const User = require("../../models/UserSchema");

app.use(express.urlencoded({ extended: false }));

router.post("/", async (req, res) => {
  const users = await User.find({
    $or: [
      { firstName: { $regex: req.body.searchBy, $options: "i" } },
      { lastName: { $regex: req.body.searchBy, $options: "i" } },
      { username: { $regex: req.body.searchBy, $options: "i" } },
    ],
  });

  res.send(users);
});

module.exports = router;
