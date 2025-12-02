import { redirect } from "@tanstack/react-router";

export function googleAuth() {
  return redirect({
    href: `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({
      access_type: "offline",
      client_id: process.env.GOOGLE_CLIENT_ID!,
      redirect_uri: `${process.env.VITE_BASE_URL}/api/auth/google/callback`,
      response_type: "code",
      scope: "email",
    })}`,
  });
}
