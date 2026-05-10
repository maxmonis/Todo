import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { db } from "@/prisma/db";
import { authMiddleware } from "../auth/authMiddleware";

export const addTodo = createServerFn({
  method: "POST",
})
  .middleware([authMiddleware])
  .inputValidator(z.string().min(1))
  .handler(({ context: { userId }, data: text }) =>
    db.todo.create({ data: { text, userId }, omit: { userId: true } }),
  );
