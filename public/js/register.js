var password = document.getElementById("password");
var confirm_password = document.getElementById("confirmPassword");
var form = document.getElementById("register-form");

function validateForm() {
  if (password.value == confirm_password.value) {
    form.submit();
  } else {
    alert("Password does not match");
  }
}
