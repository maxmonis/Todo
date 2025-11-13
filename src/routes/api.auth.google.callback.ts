import { createFileRoute, redirect } from "@tanstack/react-router"
import { useAuthSession } from "~/features/auth/useAuthSession"
import { db } from "~/server/mongoose"

export let Route = createFileRoute("/api/auth/google/callback")({
  server: {
    handlers: {
      async GET({ request }) {
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

        let tokenData = await tokenRes.json()
        if (!tokenRes.ok) {
          console.error("Google token exchange failed", tokenData)
          throw new Error("Failed to exchange token with Google")
        }

        let userRes = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          { headers: { Authorization: `Bearer ${tokenData.access_token}` } },
        )
        let { email } = await userRes.json()
        if (typeof email != "string")
          throw new Error("No email returned from Google")

        let user = await db.User.findOne({ email })
        user ??= await db.User.create({ email })

        let session = await useAuthSession()
        await session.update({
          email: user.email,
          userId: user._id.toString(),
        })

        throw redirect({ href: process.env.VITE_BASE_URL })
      },
    },
  },
})
