const express = require("express");
const app = express();
const router = express.Router();

app.set("view engine", "ejs");
app.set("views", "views");

router.get("/", async (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

module.exports = router;
