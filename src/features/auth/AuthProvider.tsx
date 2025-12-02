import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { clearSession } from "./clearSession";
import { loadUser } from "./loadUser";

export function AuthProvider({ children }: React.PropsWithChildren) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] =
    useState<NonNullable<React.ContextType<typeof AuthContext>>["user"]>(null);

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
        },
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
