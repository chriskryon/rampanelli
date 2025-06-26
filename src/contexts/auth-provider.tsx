"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import type { User, AuthContextType } from "@/types/types"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verificar se o usuário está logado
    const loggedIn = localStorage.getItem("isLoggedIn") === "true"
    const userData = localStorage.getItem("user")

    if (loggedIn && userData) {
      setUser(JSON.parse(userData))
      setIsLoggedIn(true)
    }

    setIsLoading(false)
  }, [])

  useEffect(() => {
    // Redirecionar para login se não estiver logado
    if (!isLoading) {
      if (!isLoggedIn && pathname !== "/login") {
        router.push("/login")
      }
    }
  }, [isLoggedIn, pathname, router, isLoading])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simular verificação de login
    if (email === "admin@rampaneli.com" && password === "admin123") {
      const userData = { name: "Administrador", email }
      localStorage.setItem("isLoggedIn", "true")
      localStorage.setItem("user", JSON.stringify(userData))
      setUser(userData)
      setIsLoggedIn(true)
      return true
    }
    return false
  }

  const logout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("user")
    setUser(null)
    setIsLoggedIn(false)
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
      {isLoading ? null : children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
