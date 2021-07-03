$(document).ready(() => {
  //get display pic and username
  $.get(`/api/chats/${chatId}`, (chatData) => {
    var displayContainer = $(".chatTitleBarContainer");
    var chatName = getChatName(chatData);
    if (chatData.isGroupChat) {
      var img = chatData.groupChatPic;
    } else {
      var img = chatData.users[0].profilePic;
    }

    var displayInfoHtml = addDisplayInfo(chatName, img);
    displayContainer.append(displayInfoHtml);
  });

  socket.emit("join room", chatId);

  $.get(`/api/chats/${chatId}/messages`, (data) => {
    var messages = [];
    var lastSenderId = "";
    data.forEach((message, index) => {
      var html = createMessageHtml(message, data[index + 1], lastSenderId);
      messages.push(html);

      lastSenderId = message.sender._id;
    });
    var messagesHtml = messages.join("");
    addMessagesHtmlToPage(messagesHtml);
    scrollToBottom(false);

    $(".loadingSpinnerContainer").remove();
    $(".chatContainer").css("visibility", "visible");
  });
});

$(".sendMessageButton").click((event) => {
  messageSubmitted();
});

$(".inputTextbox").keydown((event) => {
  if (event.which === 13) {
    messageSubmitted();
    return false;
  }
});

function addDisplayInfo(chatName, img) {
  return `
    <div class="displayInfo">
      <img src="${img}" alt="display pic" />
      <span class="username">${chatName}</span>
    </div>
    `;
}

function getChatName(chatData) {
  var chatName = chatData.chatName;

  if (!chatName) {
    var otherChatUsers = getOtherChatUsers(chatData.users);
    var namesArray = otherChatUsers.map((user) => user.username);
    chatName = namesArray.join(", ");
  }

  return chatName;
}

function getOtherChatUsers(users) {
  if (users.length == 1) return users;

  return users.filter((user) => {
    return user._id != userLoggedInJs._id;
  });
}

function addMessagesHtmlToPage(html) {
  $(".chatMessages").append(html);

  //todo: scroll to bottom
}

function messageSubmitted() {
  var content = $(".inputTextbox").val().trim();

  if (content != "") {
    sendMessage(content);
    $(".inputTextbox").val("");
  }
}

function sendMessage(content) {
  $.post(
    "/api/messages",
    { content: content, chatId: chatId },
    (data, status, xhr) => {
      if (xhr.status != 201) {
        alert("Could not send message");
        $(".inputTextbox").val(content);
        return;
      }

      console.log("this is data after api request", data);

      addChatMessageHtml(data);

      if (connected) {
        socket.emit("new message", data);
      }
    }
  );
}

function addChatMessageHtml(message) {
  if (!message || !message._id) {
    alert("message is not valid");
    return;
  }

  var messageDiv = createMessageHtml(message, null, "");

  addMessagesHtmlToPage(messageDiv);
  scrollToBottom(true);
}

function createMessageHtml(message, nextMessage, lastSenderId) {
  var sender = message.sender;
  var senderName = sender.firstName + " " + sender.lastName;

  var currentSenderId = sender._id;

  var nextSenderId = nextMessage != null ? nextMessage.sender._id : "";

  var isFirst = lastSenderId != currentSenderId;
  var isLast = nextSenderId != currentSenderId;

  var isMine = message.sender._id == userLoggedInJs._id;
  var liClassName = isMine ? "mine" : "theirs";

  var nameElement = "";
  if (isFirst) {
    liClassName += " first";
    if (!isMine) {
      nameElement = `<span class='senderName'>${senderName}</span>`;
    }
  }

  if (isLast) {
    liClassName += " last";
  }

  return `
<li class="message ${liClassName}">
  <div class="messageContainer">
  ${nameElement}
    <span class="messageBody">${message.content}</span>
  </div>
</li>
    `;
}

function scrollToBottom(animated) {
  var container = $(".chatMessages");

  var scrollHeight = container[0].scrollHeight;

  if (animated) {
    container.animate({ scrollTop: scrollHeight }, "slow");
  } else {
    container.scrollTop(scrollHeight);
  }
}
