import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "../auth/authMiddleware";
import { db } from "@/prisma/db";

export const loadTodos = createServerFn()
  .middleware([authMiddleware])
  .handler(async ({ context: { userId } }) => {
    return await db.todo.findMany({
      omit: {
        userId: true,
      },
      orderBy: {
        id: "asc",
      },
      where: {
        userId,
      },
    });
  });
