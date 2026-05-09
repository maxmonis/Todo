import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "./AuthContext";
import { clearSession } from "./clearSession";
import { loadUser } from "./loadUser";

export function AuthProvider({ children }: React.PropsWithChildren) {
  const queryClient = useQueryClient();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<Awaited<ReturnType<typeof loadUser>>>(null);

  useEffect(() => {
    init();
  }, []);

  async function init() {
    const res = await loadUser();
    setLoading(false);
    setUser(res);
  }

  return (
    <AuthContext.Provider
      value={{
        loading,
        logout: () => {
          clearSession();
          setUser(null);
          queryClient.clear();
        },
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
