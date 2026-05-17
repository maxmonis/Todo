import { useAuth } from "../context/useAuth";
import { LoginButton } from "./LoginButton";
import { LogoutButton } from "./LogoutButton";

export function AuthButton() {
  const { loading, logout, user } = useAuth();

  if (loading) return null;

  if (!user) return <LoginButton />;

  return <LogoutButton email={user.email} logout={logout} />;
}
