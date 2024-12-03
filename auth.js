import z from "zod";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { UserModel } from "./db.js";
const JWT_SECRET = "IloveJS";

await mongoose.connect(
    "mongodb+srv://sudeephukkerikar234:KuF233b20skotL6G@cluster0.mqtit.mongodb.net/Todo-App"
);

async function signUp(req, res) {
    const { username, email, password } = req.body;
    const validSchema = z.object({
        username: z.string().min(5).max(100),
        email: z.string().email().max(100),
        password: z.string().min(8).max(100),
    });
    const validInput = validSchema.safeParse({
        username,
        email,
        password,
    });

    if (!validInput.success) {
        res.status(400).json({
            message: validInput.error.issues,
        });
        return;
    }

    // DB entries
    try {
        await UserModel.create({
            username,
            email,
            password,
        });

        return res.status(200).json({
            message: "Signed Up Successfully!",
        });
    } catch (e) {
        return res.status(500).json({
            message: "Something went bad on our end!",
            error: e,
        });
    }
}

async function signIn(req, res) {
    const { username, password } = req.body;
    const validSchema = z.object({
        username: z.string().min(5).max(100),
        password: z.string().min(8).max(100),
    });
    const validInput = validSchema.safeParse({
        username,
        password,
    });
    if (!validInput.success) {
        res.status(400).json({
            message: validInput.error.issues,
        });
        return;
    }

    // Signing In User
    try {
        const user = await UserModel.findOne({
            username: username,
        });

        if (user) {
            const token = jwt.sign(
                {
                    userId: user._id,
                },
                JWT_SECRET
            );

            return res.status(200).json({
                message: "Signed In Successfully!",
                token: token,
            });
        } else {
            return res.status(400).json({
                message: "User does not exist!",
            });
        }
    } catch (e) {
        return res.status(500).json({
            message: "Something went bad on our end!",
            error: e,
        });
    }
}

async function auth(req, res, next) {
    const token = req.headers.token;
    const verifiedUser = jwt.verify(token, JWT_SECRET);

    if (verifiedUser) {
        req.userId = verifiedUser.userId;
        next();
    } else {
        return res.status(400).json({
            message: "Invalid Token!",
        });
    }
}

export { signUp, signIn, auth };
