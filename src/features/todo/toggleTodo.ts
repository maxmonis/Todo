import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "../auth/authMiddleware";
import { db } from "@/prisma/db";

export const toggleTodo = createServerFn({
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

    const { checked } = await db.todo.update({
      data: {
        checked: !todo.checked,
      },
      select: {
        checked: true,
      },
      where: {
        id,
      },
    });

    return {
      checked,
      id,
    };
  });
