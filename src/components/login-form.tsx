"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lock, User, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simular verificação de login
    setTimeout(() => {
      if (email === "admin@rampanelli.com" && password === "admin123") {
        localStorage.setItem("isLoggedIn", "true")
        localStorage.setItem("user", JSON.stringify({ name: "Administrador", email }))

        window.location.href = "/"
      } else {
        setError("Email ou senha inválidos. Tente admin@rampanelli.com / admin123")
      }
      setIsLoading(false)
    }, 1500)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="bg-black/30 backdrop-blur-xl border-white/10">
        <CardHeader>
          <CardTitle className="text-2xl text-white font-sfpro">Login</CardTitle>
          <CardDescription className="text-gray-400">Acesse o sistema de orçamentos</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="bg-red-500/10 text-red-500 border-red-500/20">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-white/5 border-[#00D4FF]/30 focus:border-[#00D4FF] text-white placeholder:text-gray-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-white">
                  Senha
                </Label>
                <a href="#" className="text-xs text-[#00D4FF] hover:underline">
                  Esqueceu a senha?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-white/5 border-[#00D4FF]/30 focus:border-[#00D4FF] text-white placeholder:text-gray-500"
                  required
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/20 backdrop-blur-sm hover:bg-[#00D4FF]/20 transition-all"
          >
            {isLoading ? (
              <>
                <span className="animate-spin mr-2 h-4 w-4 border-2 border-t-transparent border-[#00D4FF] rounded-full" />
                Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
