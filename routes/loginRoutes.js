const express = require("express");
const app = express();
const router = express.Router();
const User = require("../models/UserSchema");

app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set("views", "views");

router.get("/", async (req, res) => {
  var payload = {};
  if (req.session && req.session.user) {
    return res.redirect("/chat");
  }
  res.status(200).render("login", { payload: payload });
});

router.post("/", async (req, res) => {
  var payload = {
    username: req.body.username,
  };

  const user = await User.findOne({
    $or: [{ username: req.body.username }, { email: req.body.username }],
  }).catch((error) => {
    console.log(`error while checking logininfo ${error}`);
  });

  if (user) {
    if (user.password === req.body.password) {
      req.session.user = user;
      return res.redirect("/chat");
    } else {
      payload.error = "Password Invalid";
    }
  } else {
    payload.error = "user does not exist";
  }

  res.render("login", { payload: payload });
});

module.exports = router;
