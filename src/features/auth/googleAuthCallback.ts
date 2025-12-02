import { redirect } from "@tanstack/react-router";
import { useAuthSession } from "./useAuthSession";
import { db } from "@/server/db";

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

  const doc = await db.User.findOne({
    email,
  });

  if (doc) {
    await session.update({
      email: doc.email,
      userId: doc._id.toString(),
    });
  } else {
    const newDoc = await db.User.create({
      email,
    });

    await session.update({
      email: newDoc.email,
      userId: newDoc._id.toString(),
    });
  }

  return redirect({
    href: process.env.VITE_BASE_URL,
  });
}
