import express from "express";
import cors from "cors";
import bs58 from "b58";
import dotenv from "dotenv";
import jsonwebtoken from "jsonwebtoken";
import { Keypair, Transaction, Connection } from "@solana/web3.js";
import userModel from "./models/user.schema";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const connection = new Connection("https://api.mainnet-beta.solana.com");

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

app.post("/api/txn/sign", async (req, res) => {
    const serializedTransaction = req.body.message;
    const tx = Transaction.from(Buffer.from(serializedTransaction));
    const keyPair = Keypair.fromSecretKey(bs58.decode(process.env.PRIVATE_KEY));

    const { blockhash } = await connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = keyPair.publicKey;
    tx.sign(keyPair);

    await connection.sendTransaction(tx, [keyPair]);
    res.json({
        message: "Sign up"
    });
});

app.get("/api/txn", (req, res) => {
    res.json({
        message: "Sign up"
    });
});

app.listen(3000);