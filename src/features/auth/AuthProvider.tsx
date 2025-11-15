import { useEffect, useState } from "react"
import { AuthContext } from "./AuthContext"
import { clearSession } from "./clearSession"
import { loadUser } from "./loadUser"

export function AuthProvider({ children }: React.PropsWithChildren) {
  let [loading, setLoading] = useState(true)
  let [user, setUser] =
    useState<NonNullable<React.ContextType<typeof AuthContext>>["user"]>(null)

  useEffect(() => {
    init()
  }, [])

  async function init() {
    let res = await loadUser()
    setLoading(false)
    setUser(res)
  }

  return (
    <AuthContext.Provider
      value={{
        loading,
        logout: () => {
          clearSession()
          setUser(null)
        },
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
