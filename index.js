import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { signUp, signIn, auth } from "./auth.js";
import {
    getTodos,
    newTodo,
    updateTodo,
    deleteTodo,
    taskDone,
    updateTaskStatus,
} from "./routes.js";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.get("/", (req, res) => {
    res.status(200).sendFile(__dirname + "/frontend/index.html");
});

app.use(express.json());

app.get("/signup", (req, res) => {
    res.status(200).sendFile(__dirname + "/frontend/signup.html");
});
app.get("/signin", (req, res) => {
    res.status(200).sendFile(__dirname + "/frontend/signin.html");
});
app.post("/signup", signUp);
app.post("/signin", signIn);

app.use(auth);
app.get("/dashboard", (req, res) => {
    res.status(200).sendFile(__dirname + "/frontend/dashboard.html");
});
app.get("/todos", getTodos);
app.post("/todos", newTodo);
app.put("/todos", updateTodo);
app.delete("/todos", deleteTodo);
app.patch("/todoDone", taskDone);
app.patch("/todoStatus", updateTaskStatus);

app.listen(3000);
