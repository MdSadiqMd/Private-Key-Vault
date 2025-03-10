import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jsonwebtoken from "jsonwebtoken";
import userModel from "./models/user.schema";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/signup", async (req: any, res: any) => {
    const { username, password } = req.body;
    const user = await userModel.findOne({ username });
    if (user) {
        return res.status(400).json({ error: "User already exists" });
    } else {
        const user = await userModel.create({ username, password });
        const token = jsonwebtoken.sign({ id: user._id }, process.env.JWT_SECRET as string);
        return res.status(201).json({ token });
    }
});

app.post("/api/signin", async (req: any, res: any) => {
    const { username, password } = req.body;
    const user = await userModel.findOne({ username, password });
    if (!user) {
        return res.status(401).json({ error: "User not found" });
    } else {
        const token = jsonwebtoken.sign({ id: user._id }, process.env.JWT_SECRET as string);
        return res.status(200).json({ token });
    }
});
