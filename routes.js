import z from "zod";
import { TodoModel } from "./db.js";

function serverError(error) {
    console.log(error);
    res.status(500).json({
        message: "Something went bad on our end!",
    });
}

async function getNextId(userId) {
    let taskId = 0;
    const todos = await TodoModel.find({
        userId: userId,
    });
    if (todos.length == 0) {
        taskId = 1;
    } else {
        taskId += todos.length + 1;
    }

    return taskId;
}

async function getTodos(req, res) {
    try {
        const todos = await TodoModel.find({
            userId: req.userId,
        });

        return res.status(200).json({
            message: "Retrieved your todos!",
            todos: todos,
        });
    } catch (error) {
        serverError(error);
    }
}

async function newTodo(req, res) {
    const { task, description, status } = req.body;
    const inputSchema = z.object({
        task: z.string().min(1).max(100),
        description: z.string().max(300),
    });
    const validInput = inputSchema.safeParse({
        task,
        description,
    });
    if (!validInput.success) {
        return res.status(400).json({
            message: validInput.error.issues,
        });
    }

    // Enter task in DB
    try {
        const newTask = await TodoModel.create({
            taskId: "task" + (await getNextId(req.userId)).toString(),
            task,
            description,
            status,
            done: false,
            userId: req.userId,
        });

        return res.status(200).json({
            message: "Task Added Successfully!",
            taskId: newTask.taskId,
        });
    } catch (error) {
        serverError(error);
    }
}

async function updateTodo(req, res) {
    const { task, updatedTask, updatedDescription } = req.body;
    const inputSchema = z.object({
        task: z.string().min(1).max(100),
        updatedTask: z.string().min(1).max(100),
        updatedDescription: z.string().max(300),
    });
    const validInput = inputSchema.safeParse({
        task,
        updatedTask,
        updatedDescription,
    });
    if (!validInput.success) {
        return res.status(400).json({
            message: validInput.error.issues,
        });
    }

    // Updating task in DB
    try {
        await TodoModel.updateOne(
            {
                task: task,
            },
            {
                task: updatedTask,
                description: updatedDescription,
            }
        );

        return res.status(200).json({
            message: "Task updated successfully!",
        });
    } catch (error) {
        serverError(error);
    }
}

async function deleteTodo(req, res) {
    const { taskId, confirmation } = req.body;

    try {
    } catch (error) {
        console.log(error);
    }
}

async function taskDone(req, res) {
    const { taskId } = req.body;

    try {
        await TodoModel.updateOne(
            {
                taskId: taskId,
            },
            {
                done: true,
            }
        );

        res.status(200).json({
            message: "Task marked as done!",
        });
    } catch (error) {
        serverError(error);
    }
}

async function updateTaskStatus(req, res) {
    let { taskId, status } = req.body;
    const statusArr = ["Not started", "In Progress", "Completed"];

    try {
        if (statusArr.includes(status)) {
            await TodoModel.updateOne(
                {
                    taskId: taskId,
                },
                {
                    status: status,
                }
            );

            res.status(200).json({
                message: "Status updated!",
            });
        } else {
            res.status(400).json({
                message: "Invalid Request!",
            });
        }
    } catch (error) {
        serverError(error);
    }
}

export {
    getTodos,
    newTodo,
    updateTodo,
    deleteTodo,
    taskDone,
    updateTaskStatus,
};
