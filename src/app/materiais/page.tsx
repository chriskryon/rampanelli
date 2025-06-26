"use client"

import { useEffect } from "react"
import { OrcamentoProvider } from "@/contexts/orcamento-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { GerenciadorMateriais } from "@/components/gerenciador-materiais"
import { useRouter } from "next/navigation"

export default function MateriaisPage() {
  const router = useRouter()

  useEffect(() => {
    // Verificar se o usuário está logado
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    if (!isLoggedIn) {
      router.push("/login")
    }
  }, [router])

  return (
    <OrcamentoProvider>
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#0A0A0B] to-[#1C2526]">
        <div className="noise"></div>
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <GerenciadorMateriais />
        </main>
        <Footer />
      </div>
    </OrcamentoProvider>
  )
}
