import { redirect } from "@tanstack/react-router"
import { db } from "~/server/db"
import { useAuthSession } from "./useAuthSession"

export async function googleAuthCallback({ request }: { request: Request }) {
  let code = new URL(request.url).searchParams.get("code")
  if (!code) throw redirect({ href: process.env.VITE_BASE_URL })

  let tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      code,
      grant_type: "authorization_code",
      redirect_uri: `${process.env.VITE_BASE_URL}/api/auth/google/callback`,
    }),
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    method: "POST",
  })
  let { access_token } = await tokenRes.json()
  if (typeof access_token != "string") throw Error("No access token")

  let userRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${access_token}` },
  })
  let { email } = await userRes.json()
  if (typeof email != "string") throw Error("No email")

  let user = await db.User.findOne({ email })
  user ??= await db.User.create({ email })

  let session = await useAuthSession()
  await session.update({ email: user.email, userId: user._id.toString() })

  return redirect({ href: process.env.VITE_BASE_URL })
}
