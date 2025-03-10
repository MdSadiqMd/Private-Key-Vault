import mongoose from "mongoose";

mongoose.connect(process.env.MONGODB_URL as string);

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    privateKey: String,
    publicKey: String
});

const userModel = new mongoose.Model("users", UserSchema);

export default userModel;