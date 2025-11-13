import { createContext, useContext, useEffect, useState } from "react"
import { clearSession } from "./clearSession"
import { loadUser } from "./loadUser"

interface AuthContext {
  loading: boolean
  logout: () => void
  user: { email: string } | null
}

let Context = createContext<AuthContext | null>(null)

export function AuthProvider({ children }: React.PropsWithChildren) {
  let [loading, setLoading] = useState(true)
  let [user, setUser] = useState<AuthContext["user"]>(null)

  useEffect(() => {
    init()
  }, [])

  async function init() {
    let res = await loadUser()
    setLoading(false)
    setUser(res)
  }

  return (
    <Context.Provider
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
    </Context.Provider>
  )
}

export function useAuth() {
  let context = useContext(Context)
  if (context) return context
  throw Error("useAuth must be used within AuthProvider")
}
