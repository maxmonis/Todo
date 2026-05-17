import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/features/auth/server/authMiddleware";
import { db } from "@/prisma/db";

export const addTodo = createServerFn({
  method: "POST",
})
  .middleware([authMiddleware])
  .inputValidator(z.string().trim().min(1))
  .handler(({ context: { userId }, data: text }) =>
    db.todo.create({ data: { text, userId }, omit: { userId: true } }),
  );
