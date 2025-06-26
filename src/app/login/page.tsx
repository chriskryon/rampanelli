import { LoginForm } from "@/components/login-form"
import Image from "next/image"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-[#0A0A0B] to-[#1C2526]">
      <div className="noise"></div>
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div className="absolute inset-0 bg-black/60 z-10 flex items-center justify-center">
          <div className="text-center p-8">
            <h1 className="text-4xl font-bold text-white mb-2 font-sfpro">Rampanelli Planejados</h1>
            <p className="text-white/80 max-w-md mx-auto">
              Sistema de gerenciamento de orçamentos para móveis planejados de alta qualidade
            </p>
          </div>
        </div>
        <div className="relative w-full h-full">
          <Image
            src="/images/login-background.png"
            alt="Móveis planejados"
            fill
            className="object-cover blur-[4px]"
            priority
          />
          <div className="absolute inset-0 bg-black/30 backdrop-filter backdrop-blur-sm">
            <div className="noise" style={{ opacity: "0.2" }}></div>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 lg:hidden">
            <h1 className="text-3xl font-bold text-white mb-2 font-sfpro">Rampanelli Planejados</h1>
            <p className="text-white/80">Sistema de gerenciamento de orçamentos</p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
