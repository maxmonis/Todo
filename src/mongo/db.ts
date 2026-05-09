import mongoose from "mongoose";
import { connectDB } from "./connectDB";

interface TodoDoc {
  checked?: boolean;
  text: string;
  userId: mongoose.Schema.Types.ObjectId;
}

interface UserDoc {
  email: string;
}

const todoSchema = new mongoose.Schema<TodoDoc>({
  checked: {
    type: Boolean,
  },
  text: {
    required: true,
    type: String,
  },
  userId: {
    ref: "User",
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  },
});

const userSchema = new mongoose.Schema<UserDoc>({
  email: {
    required: true,
    type: String,
  },
});

const Todo: mongoose.Model<TodoDoc> =
  mongoose.models.Todo ?? mongoose.model("Todo", todoSchema);

const User: mongoose.Model<UserDoc> =
  mongoose.models.User ?? mongoose.model("User", userSchema);

export const db = {
  Todo,
  User,
};

connectDB();
