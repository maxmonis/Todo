import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "../auth/authMiddleware";
import { db } from "@/prisma/db";

export const addTodo = createServerFn({
  method: "POST",
})
  .middleware([authMiddleware])
  .inputValidator(z.string().min(1))
  .handler(async ({ context: { userId }, data: text }) => {
    return await db.todo.create({
      data: {
        text,
        userId,
      },
      omit: {
        userId: true,
      },
    });
  });
