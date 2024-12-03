import mongoose from "mongoose";
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const User = new Schema({
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    password: String,
});

const Todo = new Schema({
    taskId: String,
    task: String,
    description: String,
    status: String,
    done: Boolean,
    userId: ObjectId,
});

const UserModel = mongoose.model("users", User);
const TodoModel = mongoose.model("todos", Todo);

export { UserModel, TodoModel };
