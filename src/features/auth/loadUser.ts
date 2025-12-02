import { createServerFn } from "@tanstack/react-start";
import { isValidObjectId } from "mongoose";
import { useAuthSession } from "./useAuthSession";
import { db } from "@/server/db";

export const loadUser = createServerFn().handler(async () => {
  const session = await useAuthSession();
  const { userId } = session.data;

  if (!userId) {
    return null;
  }

  if (!isValidObjectId(userId)) {
    await session.clear();
    return null;
  }

  const doc = await db.User.findById(userId);
  if (!doc) {
    await session.clear();
    return null;
  }

  const { email } = doc;
  await session.update({
    email,
    userId,
  });

  return {
    email,
  };
});
