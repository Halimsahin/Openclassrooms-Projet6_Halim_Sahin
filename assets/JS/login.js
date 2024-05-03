const btnLogin = document.getElementById("log-in");
const error = document.querySelector(".error");

async function logIn() {
  const email = document.getElementById("email");
  const password = document.getElementById("password");
    const users = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.value, password: password.value }),
    });

    const usersJson = await users.json();
    console.log(users)
    if (users.status === 200) {
      localStorage.setItem("token", usersJson.token);
      document.location.href = "/";
    } else {
    error.innerText = "Email ou mot de passe incorrect";
    error.style.color = "red";
    error.style.margin = "10px";
    }
  }


btnLogin.addEventListener("click", (e) => {
  e.preventDefault();
  logIn();
});
