import { createContext, useContext, useState } from "react"

export type Cliente = {
  id: string
  nome: string
  email: string
  telefone: string
}

type ClienteContextType = {
  clientes: Cliente[]
  buscarClientes: (busca: string) => Cliente[]
  adicionarCliente: (cliente: Cliente) => void
}

const ClienteContext = createContext<ClienteContextType |   undefined>(undefined)

export function ClienteProvider({ children }: { children: React.ReactNode }) {
  const [clientes, setClientes] = useState<Cliente[]>([
    {
      id: "1",
      nome: "João da Silva",
      email: "",
        telefone: "11987654321"
    }
  ])

  function buscarClientes(busca: string) {
    if (!busca) return []
    return clientes.filter(
      c => c.nome.toLowerCase().includes(busca.toLowerCase()) ||
           c.email.toLowerCase().includes(busca.toLowerCase()) ||
           c.telefone.includes(busca)
    )
  }

  function adicionarCliente(cliente: Cliente) {
    setClientes(prev => [...prev, cliente])
  }

  return (
    <ClienteContext.Provider value={{ clientes, buscarClientes, adicionarCliente }}>
      {children}
    </ClienteContext.Provider>
  )
}

export function useClientes() {
  const ctx = useContext(ClienteContext)
  if (!ctx) throw new Error("useClientes must be used within a ClienteProvider")
  return ctx
}
