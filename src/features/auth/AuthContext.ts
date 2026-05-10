import { createContext } from "react";
import type { loadUser } from "./loadUser";

interface Context {
  loading: boolean;
  logout: () => void;
  user: User | null;
}

type User = Awaited<ReturnType<typeof loadUser>>;

export const AuthContext = createContext<Context | null>(null);
