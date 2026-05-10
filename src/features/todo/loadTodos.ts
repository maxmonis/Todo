import { createServerFn } from "@tanstack/react-start";
import { db } from "@/prisma/db";
import { authMiddleware } from "../auth/authMiddleware";

export const loadTodos = createServerFn()
  .middleware([authMiddleware])
  .handler(({ context: { userId } }) =>
    db.todo.findMany({
      omit: { userId: true },
      orderBy: { id: "asc" },
      where: { userId },
    }),
  );
