import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "../auth/authMiddleware";
import { db } from "@/mongo/db";

export const loadTodos = createServerFn()
  .middleware([authMiddleware])
  .handler(async ({ context: { userId } }) => {
    const docs = await db.Todo.find({
      userId,
    }).lean();

    const todos = docs.map(({ _id, checked = false, text }) => {
      return {
        checked,
        id: _id.toString(),
        text,
      };
    });

    return todos;
  });
