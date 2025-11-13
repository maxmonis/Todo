import { createServerFn } from "@tanstack/react-start"
import z from "zod"
import { db } from "~/server/mongoose"
import { authMiddleware } from "../auth/authMiddleware"

export let addTodo = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(z.string().min(1))
  .handler(async ({ context: { userId }, data: text }) => {
    let doc = await db.Todo.create({ text, userId })
    return { checked: false, id: doc._id.toString(), text: doc.text }
  })
