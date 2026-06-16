document
  .getElementById("btn-submit-auth")
  .addEventListener("click", function () {
    const userField = document.getElementById("app-username");
    const passwordField = document.getElementById("app-password");

    const typedUser = userField.value.trim().toLowerCase();
    const typedPassword = passwordField.value.trim();

    // Guard Clause Validation
    if (typedUser !== "admin" || typedPassword !== "admin123") {
      alert("Invalid Credentials! Please try again.");
      return;
    }

    // Success Workflow
    alert("Authentication Successful! Redirecting...");
    window.location.assign("./home/home.html");
  });
