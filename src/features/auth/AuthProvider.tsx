import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { clearSession } from "./clearSession";
import { loadUser } from "./loadUser";

export function AuthProvider({ children }: React.PropsWithChildren) {
  const queryClient = useQueryClient();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<Awaited<ReturnType<typeof loadUser>>>(null);

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
