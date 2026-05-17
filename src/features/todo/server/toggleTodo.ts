import { createServerFn } from "@tanstack/react-start";
import { setResponseStatus } from "@tanstack/react-start/server";
import { z } from "zod";
import { authMiddleware } from "@/features/auth/server/authMiddleware";
import { db } from "@/prisma/db";

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

    if (!todo) {
      setResponseStatus(404);
      throw Error("Not found");
    }

    if (todo.userId !== userId) {
      setResponseStatus(403);
      throw Error("Not authorized");
    }

    const checked = !todo.checked;

    await db.todo.update({ data: { checked }, where: { id } });

    return { checked, id };
  });
