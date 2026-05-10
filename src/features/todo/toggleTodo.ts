import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { db } from "@/prisma/db";
import { authMiddleware } from "../auth/authMiddleware";

export const toggleTodo = createServerFn({
  method: "POST",
})
  .middleware([authMiddleware])
  .inputValidator(z.cuid())
  .handler(async ({ context: { userId }, data: id }) => {
    const todo = await db.todo.findUnique({
      select: { checked: true, userId: true },
      where: { id },
    });

    if (!todo) throw Error("Not found");

    if (todo.userId !== userId) throw Error("Not authorized");

    const checked = !todo.checked;

    await db.todo.update({ data: { checked }, where: { id } });

    return { checked, id };
  });
