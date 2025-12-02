import { createServerFn } from "@tanstack/react-start";
import { useAuthSession } from "./useAuthSession";

export const clearSession = createServerFn({
  method: "POST",
}).handler(async () => {
  const session = await useAuthSession();
  await session.clear();
  return "Session cleared";
});
