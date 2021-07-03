$(document).ready(() => {
  var container = $(".main-layout");
  var profileHtml = userProfileHtml();
  container.append(profileHtml);
});

function userProfileHtml() {
  return `
<div class="user-profile">
  <div class="user-image">
    <img src="${userLoggedInJs.profilePic}" alt="" />
  </div>
  <div class="user-info">
    <div>
      <label>username:</label>
      <span>${userLoggedInJs.username}</span>
    </div>
    <div>
      <label>name:</label>
      <span>
        ${userLoggedInJs.firstName} ${userLoggedInJs.lastName}
      </span>
    </div>
    <div>
      <label>email:</label>
      <span>${userLoggedInJs.email}</span>
    </div>
  </div>
</div>
    `;
}
