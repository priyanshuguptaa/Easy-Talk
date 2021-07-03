const express = require("express");
const app = express();
const router = express.Router();
const User = require("../models/UserSchema");

app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set("views", "views");

router.get("/", async (req, res) => {
  res.status(200).render("register");
});

router.post("/", async (req, res) => {
  const user = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  };

  const createdUser = await User.create(user).catch((err) => console.log(err));

  res.redirect("/login");
});

module.exports = router;
