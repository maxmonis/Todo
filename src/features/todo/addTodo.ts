import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "../auth/authMiddleware";
import { db } from "@/server/db";

export const addTodo = createServerFn({
  method: "POST",
})
  .middleware([authMiddleware])
  .inputValidator(z.string().min(1))
  .handler(async ({ context: { userId }, data: text }) => {
    const doc = await db.Todo.create({
      text,
      userId,
    });

    return {
      checked: false,
      id: doc._id.toString(),
      text: doc.text,
    };
  });
