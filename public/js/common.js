function messageRecieved(newMessage) {
  if ($(`[data-room="${newMessage.chat._id}"]`).length == 0) {
    // show popup notification
  } else {
    addChatMessageHtml(newMessage);
  }
}
