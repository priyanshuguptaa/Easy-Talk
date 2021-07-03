$(document).ready(() => {
  $.get("/api/chats", (data, status, xhr) => {
    if (xhr.status == 400) {
      alert("could not get chat list");
    } else {
      outputChatList(data, $("#chat-results"));
    }
  });
});

function outputChatList(chatList, container) {
  chatList.forEach((chat) => {
    var html = createChatHtml(chat);
    container.append(html);
  });

  if (chatList.length == 0) {
    container.append("<span className='noResults'> Nothing to Show </span>");
  }
}

function createChatHtml(chatData) {
  var chatName = getChatName(chatData);
  var image = getChatImageElements(chatData);
  var latestMessage = getLatestMessage(chatData.latestMessage);

  return `
  <a href="/messages/${chatData._id}" class="resultListItem">
  <div class='resultsImageContainer'>${image}</div>
  <div class="resultsDetailsContainer ellipsis">
    <span class="heading ellipsis">${chatName}</span>
    <span class="subText ellipsis">${latestMessage}</span>
  </div>
</a>
  `;
}

function getLatestMessage(latestMessage) {
  if (latestMessage != null) {
    var sender = latestMessage.sender;
    return `${sender.username}: ${latestMessage.content}`;
  }
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

function getChatImageElements(chatData) {
  var otherChatUsers = getOtherChatUsers(chatData.users);

  if (chatData.isGroupChat) {
    return `<img src='${chatData.groupChatPic}' alt='group chat image' >`;
  } else if (otherChatUsers.length == 1) {
    var user = otherChatUsers[0];
    return `<img src='${user.profilePic}' alt='chat image' >`;
  }
}
