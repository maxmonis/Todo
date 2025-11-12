import mongoose from "mongoose"

interface TodoDoc {
  text: string
  userId: {
    ref: "User"
    required: true
    type: mongoose.Schema.Types.ObjectId
  }
}

interface UserDoc {
  email: string
}

let todoSchema = new mongoose.Schema<TodoDoc>({
  text: { required: true, type: String },
  userId: { ref: "User", required: true, type: mongoose.Schema.Types.ObjectId },
})

let userSchema = new mongoose.Schema<UserDoc>({
  email: { required: true, type: String },
})

export let db = {
  Todo:
    (mongoose.models.Todo as mongoose.Model<TodoDoc>) ??
    mongoose.model("Todo", todoSchema),
  User:
    (mongoose.models.User as mongoose.Model<UserDoc>) ??
    mongoose.model("User", userSchema),
}

async function connectDB() {
  try {
    mongoose.set("strictQuery", false)
    await mongoose.connect(process.env.MONGO_URI!)
    console.log("MongoDB connected")
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error)
    process.exit(1)
  }
}

connectDB()
