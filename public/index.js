async function signUpUser() {
    const request = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({
            username: document.getElementById("username").value,
            password: document.getElementById("password").value,
        }),
    });
    const response = await request.json();

    console.log(response.message);
}

async function signInUser() {
    const request = await fetch("http://localhost:3000/signin", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({
            username: document.getElementById("username").value,
            password: document.getElementById("password").value,
        }),
    });
    const response = await request.json();

    window.localStorage.setItem("token", response.token);
    window.location.href = `http://localhost:3000${response.url}`;
}

async function getUserInfo() {
    const request = await fetch("http://localhost:3000/me", {
        method: "GET",
        headers: {
            token: window.localStorage.getItem("token"),
        },
    });
    const response = await request.json();

    const board = document.querySelector(".board");
    const username = document.createElement("h2");
    username.textContent = response.username;
    board.appendChild(username);
}
