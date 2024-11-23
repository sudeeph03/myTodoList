import express from "express";
import JWT from "jsonwebtoken";

const app = express();
const JWT_SECRET = "iloveJS";
const users = [];

app.use(express.json());

app.get("/users", (req, res) => {
    res.status(200).json({
        users,
    });
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
    });
});

app.get("/me", (req, res) => {
    const token = req.headers.token;
    const verifiedUser = JWT.verify(token, JWT_SECRET);

    if (verifiedUser) {
        res.status(200).json({
            message: "Hello User!",
        });
    } else {
        res.status(400).json({
            message: "Invalid Request!",
        });
    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
