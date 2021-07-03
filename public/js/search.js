selectedUser = [];

$("#search-submit-button").click((event) => {
  var searchBy = document.getElementById("search-input").value;

  var displayUserContainer = $("#search-results");
  displayUserContainer.html("");

  $.post("/api/users", { searchBy: searchBy }, (users) => {
    if (users) {
      users.map((user) => {
        if (user._id == userLoggedInJs._id) {
          return;
        }
        displayUserContainer.prepend(displayUser(user));
      });
    } else {
      displayUserContainer.prepend("<p> No user found </p>");
    }
  });
});

$(document).on("click", ".addToGroup", (event) => {
  var user = $(event.target).data().username;
  var groupMembersContainer = $("#group-members");
  if (!selectedUser.includes(user)) {
    selectedUser.push(user);

    if (selectedUser.length != 0) {
      $("#group-members").show();
    }

    var newMember = displayGroupMember(user);
    groupMembersContainer.append(newMember);

    $("#search-input").focus();
  }
});

$(document).on("click", ".remove-member", (event) => {
  var user = $(event.target).data().username;
  var index = selectedUser.indexOf(user);
  if (index > -1) {
    selectedUser.splice(index, 1);
    var container = $("#group-members");
    renderGroupMember(container, selectedUser);
  }
  if (selectedUser.length == 0) {
    $("#group-members").hide();
  }
});

$("#create-group-button").click((event) => {
  var container = $("#group-members");

  if (selectedUser.length > 1) {
    var data = JSON.stringify(selectedUser);

    console.log(data);
    selectedUser = [];
    renderGroupMember(container, selectedUser);

    $.post("/api/chats", { users: data }, (chat) => {
      if (!chat || !chat._id) return alert("Invalid response from server");

      window.location.href = `/messages/${chat._id}`;
    });
  }
});

function displayUser(user) {
  return `
<div class="user-container" data-id="${user._id}" data-username="${user.username}">
    <div class="image-container">
        <img src="${user.profilePic}" alt="user image" />
    </div>
    <div class="user-info">
        <p class="username">@${user.username}</p>
        <p class="name">${user.firstName} ${user.lastName}</p>
    </div>
    <button class="addToGroup" data-username="${user.username}">Add to group</button>
    <button class="chat-button" data-id="${user._id}"><a href='/messages/${user._id}'>chat</a></button>
</div>
      `;
}

function displayGroupMember(username) {
  return `
  <span class="group-member">
  ${username}
  <span class="remove-member" data-username="${username}">
    x
  </span>
</span>
  `;
}

function renderGroupMember(container, groupMembers) {
  container.html("");

  groupMembers.map((member) => {
    var memberHtml = displayGroupMember(member);
    container.append(memberHtml);
  });
}
