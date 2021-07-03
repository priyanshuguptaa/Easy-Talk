const express = require("express");
const app = express();
const router = express.Router();
const middleware = require("../middleware");
const User = require("../models/UserSchema");

app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set("views", "views");

router.get("/", middleware.requireLogin, async (req, res) => {
  res.status(200).render("search", {
    userLoggedInJs: JSON.stringify(req.session.user),
  });
});

module.exports = router;
