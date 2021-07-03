const express = require("express");
const http = require("http");
const app = express();
const path = require("path");
const connectDB = require("./database");
const dotenv = require("dotenv").config();
const port = process.env.PORT;
const socketio = require("socket.io");
const server = http.createServer(app);
const io = socketio(server);
const session = require("express-session");

connectDB();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "prince",
    resave: true,
    saveUninitialized: false,
  })
);

//routes
const loginRoutes = require("./routes/loginRoutes");
const logoutRoutes = require("./routes/logoutRoutes");
const registerRoutes = require("./routes/registerRoutes");
const chatRoutes = require("./routes/chatRoutes");
const searchRoutes = require("./routes/searchRoutes");
const messageRoutes = require("./routes/messageRoutes");
const ProfileRoutes = require("./routes/profileRoutes");

//api
const userApi = require("./routes/api/users");
const chatApi = require("./routes/api/chats");
const messageApi = require("./routes/api/messages");

app.use("/login", loginRoutes);
app.use("/logout", logoutRoutes);
app.use("/register", registerRoutes);
app.use("/chat", chatRoutes);
app.use("/search", searchRoutes);
app.use("/messages", messageRoutes);
app.use("/profile", ProfileRoutes);

app.use("/api/users", userApi);
app.use("/api/chats", chatApi);
app.use("/api/messages", messageApi);

app.get("/", (req, res) => {
  res.render("index");
});

io.on("connection", (socket) => {
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join room", (room) => socket.join(room));

  socket.on("new message", (newMessage) => {
    var chat = newMessage.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessage.sender._id) return;
      socket.in(user._id).emit("message recieved", newMessage);
    });
  });
});

server.listen(port, () => console.log(`server is running on ${port}`));
