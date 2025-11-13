import { createServerFn } from "@tanstack/react-start"
import { useAuthSession } from "./useAuthSession"

export let clearSession = createServerFn({ method: "POST" }).handler(
  async () => {
    let session = await useAuthSession()
    await session.clear()
    return "Session cleared"
  },
)
