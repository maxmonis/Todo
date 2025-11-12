import { createServerFn } from "@tanstack/react-start"
import { isValidObjectId } from "mongoose"
import { createContext, useContext, useEffect, useState } from "react"
import { db } from "~/server/mongoose"
import { useAuthSession } from "./useAuthSession"

interface AuthContext {
  loading: boolean
  logout: () => void
  user: { email: string } | null
}

let Context = createContext<AuthContext | undefined>(undefined)

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
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}

let clearSession = createServerFn({ method: "POST" }).handler(async () => {
  let session = await useAuthSession()
  await session.clear()
  return "Logout successful"
})

let loadUser = createServerFn({ method: "GET" }).handler(async () => {
  let session = await useAuthSession()
  let { userId } = session.data

  if (!userId) return null
  if (!isValidObjectId(userId)) {
    await session.clear()
    return null
  }

  let doc = await db.User.findById(userId)
  if (!doc) return null

  let { email } = doc
  await session.update({ email, userId })
  return { email }
})
