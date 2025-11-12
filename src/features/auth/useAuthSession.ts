import { useSession } from "@tanstack/react-start/server"

interface AuthSession {
  email?: string
  userId?: string
}

export function useAuthSession() {
  return useSession<AuthSession>({
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV == "production",
    },
    maxAge: 60 * 60 * 24 * 14,
    name: "auth-session",
    password: process.env.SESSION_SECRET!,
  })
}
