import { createServerFn } from "@tanstack/react-start"
import { isValidObjectId } from "mongoose"
import { db } from "~/server/mongoose"
import { useAuthSession } from "./useAuthSession"

export let loadUser = createServerFn().handler(async () => {
  let session = await useAuthSession()
  let { userId } = session.data

  if (!userId) return null
  if (!isValidObjectId(userId)) {
    await session.clear()
    return null
  }

  let doc = await db.User.findById(userId)
  if (!doc) {
    await session.clear()
    return null
  }

  let { email } = doc
  await session.update({ email, userId })
  return { email }
})
