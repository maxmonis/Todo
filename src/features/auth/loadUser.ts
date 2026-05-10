import { createServerFn } from "@tanstack/react-start";
import { db } from "@/prisma/db";
import { useAuthSession } from "./useAuthSession";

export const loadUser = createServerFn().handler(async () => {
  const session = await useAuthSession();

  const { id } = session.data;

  if (!id) return null;

  const user = await db.user.findUnique({
    select: {
      email: true,
      todos: {
        orderBy: { id: "asc" },
        select: { checked: true, id: true, text: true },
      },
    },
    where: { id },
  });

  if (!user) {
    await session.clear();
    return null;
  }

  await session.update({ id });

  return user;
});
