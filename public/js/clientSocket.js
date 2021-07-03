var connected = false;

var socket = io("http://localhost:3003");

socket.emit("setup", userLoggedInJs);

socket.on("connected", () => {
  connected = true;
});

socket.on("message recieved", (newMessage) => {
  messageRecieved(newMessage);
});
