"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Mountain, LogOut, Menu, Hammer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function Header() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const navItems = [
    { href: "/", label: "Dashboard" },
    { href: "/orcamentos", label: "Orçamentos" },
    { href: "/materiais", label: "Materiais" },
  ]

  return (
    <header className="sticky top-0 z-10 backdrop-blur-xl bg-black/20 border-b border-white/10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-white font-sfpro flex items-center gap-2">
          <Hammer className="h-6 w-6" />
          <span>Rampanelli Planejados</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
                  ? "bg-white/10 text-white"
                  : "text-gray-300 hover:bg-white/5 hover:text-white",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-white">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-[#0A0A0B] border-white/10 text-white">
              <div className="flex flex-col gap-6 mt-6">
                <Link href="/" className="text-xl font-bold text-white font-sfpro flex items-center gap-2">
                  <Mountain className="h-5 w-5" />
                  <span>Rampanelli Planejados</span>
                </Link>
                <nav className="flex flex-col space-y-3">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
                          ? "bg-white/10 text-white"
                          : "text-gray-300 hover:bg-white/5 hover:text-white",
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8 border border-white/20">
                  <AvatarFallback className="bg-[#00D4FF]/10 text-[#00D4FF]">
                    {user?.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#0A0A0B] border-white/10 text-white">
              <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem className="cursor-default">
                <div className="flex flex-col">
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-sm text-gray-400">{user?.email}</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem className="cursor-pointer hover:bg-white/5">Configurações</DropdownMenuItem>
              <DropdownMenuItem onClick={logout} className="text-red-400 cursor-pointer hover:bg-red-500/10">
                <LogOut className="mr-2 h-4 w-4" /> Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/novo-orcamento" className="hidden md:block">
            <Button className="px-4 py-2 rounded-md bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/20 backdrop-blur-sm hover:bg-[#00D4FF]/20 transition-all">
              Novo Orçamento
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
