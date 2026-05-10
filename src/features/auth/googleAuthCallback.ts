import { redirect } from "@tanstack/react-router";
import { useAuthSession } from "./useAuthSession";
import { db } from "@/prisma/db";

export async function googleAuthCallback({ request }: { request: Request }) {
  const code = new URL(request.url).searchParams.get("code");
  if (!code) {
    throw redirect({
      href: process.env.VITE_BASE_URL,
    });
  }

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      code,
      grant_type: "authorization_code",
      redirect_uri: `${process.env.VITE_BASE_URL}/api/auth/google/callback`,
    }),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
  });

  const { access_token } = await tokenRes.json();
  if (typeof access_token !== "string") {
    throw Error("No access token");
  }

  const userRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  const { email } = await userRes.json();
  if (typeof email !== "string") {
    throw Error("No email");
  }

  const session = await useAuthSession();

  const user = await db.user.findUnique({
    select: {
      id: true,
    },
    where: {
      email,
    },
  });

  if (user) {
    // there's an existing user with this email
    await session.update(user);
  } else {
    // there's no existing user so create a new one
    const newUser = await db.user.create({
      data: {
        email,
      },
      select: {
        id: true,
      },
    });

    await session.update(newUser);
  }

  return redirect({
    href: process.env.VITE_BASE_URL,
  });
}
