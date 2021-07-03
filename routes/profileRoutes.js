const express = require("express");
const app = express();
const router = express.Router();
const middleware = require("../middleware");

app.set("views", "views");
app.set("view engine", "ejs");

router.get("/", middleware.requireLogin, async (req, res) => {
  res.render("profile", { userLoggedInJs: JSON.stringify(req.session.user) });
});

module.exports = router;
