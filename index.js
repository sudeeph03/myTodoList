import express from "express";
import JWT from "jsonwebtoken";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const JWT_SECRET = "iloveJS";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const users = [];

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

function verifyUser(req, res, next) {
    const token = req.headers.token;
    const verifiedUser = JWT.verify(token, JWT_SECRET);

    if (verifiedUser) {
        req.user = verifiedUser;
        next();
    } else {
        res.status(400).json({
            message: "Invalid Request!",
        });
    }
}

app.get("/users", (req, res) => {
    res.status(200).json({
        users,
    });
});

app.get("/", (req, res) => {
    return res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/signup", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const findUser = users.find((user) => user.username == username);

    if (!findUser) {
        users.push({
            username,
            password,
        });
    } else {
        return res.status(400).json({
            message: "Invalid Request!",
        });
    }

    return res.status(200).json({
        message: "Signed Up Successfully!",
    });
});

app.post("/signin", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const findUser = users.find(
        (user) => user.username == username && user.password == password
    );

    if (findUser) {
        const token = JWT.sign(
            {
                username,
            },
            JWT_SECRET
        );
        findUser.token = token;
    } else {
        return res.status(400).json({
            message: "Invalid Request!",
        });
    }

    return res.status(200).json({
        message: "Signed In Successfully!",
        token: findUser.token,
        url: "/home",
    });
});

app.get("/home", (req, res) => {
    return res.sendFile(path.join(__dirname, "public", "home.html"));
});

app.get("/me", verifyUser, (req, res) => {
    return res.status(200).json({
        message: "Hello User!",
        username: req.user.username,
    });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
