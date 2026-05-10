import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export function useAuth() {
  const context = useContext(AuthContext);

  if (context) return context;
  else throw Error("useAuth must be used within AuthProvider");
}
