import { createMiddleware } from "@tanstack/react-start";
import { isValidObjectId } from "mongoose";
import { useAuthSession } from "./useAuthSession";

export const authMiddleware = createMiddleware({
  type: "function",
}).server(async ({ next }) => {
  const {
    data: { email, userId },
  } = await useAuthSession();

  if (
    typeof email !== "string" ||
    typeof userId !== "string" ||
    !isValidObjectId(userId)
  ) {
    throw Error("Not authorized");
  }

  return next({
    context: {
      email,
      userId,
    },
  });
});
