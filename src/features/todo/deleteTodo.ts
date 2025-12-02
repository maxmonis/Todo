import { createServerFn } from "@tanstack/react-start";
import { isValidObjectId } from "mongoose";
import { z } from "zod";
import { authMiddleware } from "../auth/authMiddleware";
import { db } from "@/mongo/db";

export const deleteTodo = createServerFn({
  method: "POST",
})
  .middleware([authMiddleware])
  .inputValidator(z.string().refine((id) => isValidObjectId(id)))
  .handler(async ({ context: { userId }, data: id }) => {
    const doc = await db.Todo.findById(id);

    if (!doc) {
      throw Error("Not found");
    }

    if (doc.userId.toString() !== userId) {
      throw Error("Not authorized");
    }

    await doc.deleteOne();

    return id;
  });
