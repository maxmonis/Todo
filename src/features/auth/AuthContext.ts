import { createContext } from "react";

interface Context {
  loading: boolean;
  logout: () => void;
  user: User | null;
}

interface User {
  email: string;
}

export const AuthContext = createContext<Context | null>(null);
