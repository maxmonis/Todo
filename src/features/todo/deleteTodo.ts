import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "../auth/authMiddleware";
import { db } from "@/prisma/db";

export const deleteTodo = createServerFn({
  method: "POST",
})
  .middleware([authMiddleware])
  .inputValidator(z.cuid())
  .handler(async ({ context: { userId }, data: id }) => {
    const todo = await db.todo.findUnique({
      where: {
        id,
      },
    });

    if (!todo) {
      throw Error("Not found");
    }

    if (todo.userId !== userId) {
      throw Error("Not authorized");
    }

    await db.todo.delete({
      where: {
        id,
      },
    });

    return id;
  });
