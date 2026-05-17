import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/features/auth/server/authMiddleware";
import { db } from "@/prisma/db";

export const loadTodos = createServerFn()
  .middleware([authMiddleware])
  .handler(({ context: { userId } }) =>
    db.todo.findMany({
      omit: { userId: true },
      orderBy: { id: "asc" },
      where: { userId },
    }),
  );
