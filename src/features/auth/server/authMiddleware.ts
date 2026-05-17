import { createMiddleware } from "@tanstack/react-start";
import { useAuthSession } from "./useAuthSession";

export const authMiddleware = createMiddleware({
  type: "function",
}).server(async ({ next }) => {
  const {
    data: { id: userId },
  } = await useAuthSession();

  if (!userId) {
    throw Error("Not authorized");
  }

  return next({ context: { userId } });
});
