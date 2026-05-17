import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { clearSession } from "../server/clearSession";
import { loadUser } from "../server/loadUser";
import { AuthContext } from "./AuthContext";

type User = Awaited<ReturnType<typeof loadUser>>;

export function AuthProvider({ children }: React.PropsWithChildren) {
  const queryClient = useQueryClient();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User>(null);

  const init = async () => {
    const res = await loadUser();
    setLoading(false);
    setUser(res);
    if (res) queryClient.setQueryData(["todos"], res.todos);
  };

  const logout = () => {
    clearSession();
    setUser(null);
    queryClient.clear();
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <AuthContext.Provider value={{ loading, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
}
