import { createMiddleware } from "@tanstack/react-start"
import { isValidObjectId } from "mongoose"
import { useAuthSession } from "./useAuthSession"

export let authMiddleware = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    let {
      data: { email, userId },
    } = await useAuthSession()

    if (
      typeof email != "string" ||
      typeof userId != "string" ||
      !isValidObjectId(userId)
    )
      throw "Not authorized"

    return next({ context: { email, userId } })
  },
)
