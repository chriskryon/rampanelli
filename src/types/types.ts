export type User = {
  name: string
  email: string
}

export type AuthContextType = {
  user: User | null
  isLoggedIn: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

export type StatusOrcamento = "pendente" | "aprovado" | "rejeitado" | "em_andamento" | "concluido"

export type Item = {
  id: number
  nome: string
  valor: number
  quantidade: number
}

export type Orcamento = {
  id: string
  data: string
  nome: string
  telefone: string
  email: string
  descricao: string
  itens: Item[]
  maoDeObra: number
  custosAdicionais: {
    descricao: string
    valor: number
  }[]
  observacoes: string
  valorTotal: number
  status: StatusOrcamento
}

export type FormData = {
  nome: string
  telefone: string
  email: string
  descricao: string
  itens: Item[]
  maoDeObra: number
  custosAdicionais: {
    descricao: string
    valor: number
  }[]
  observacoes: string
}

export const defaultFormData: FormData = {
  nome: "",
  telefone: "",
  email: "",
  descricao: "",
  itens: [],
  maoDeObra: 0,
  custosAdicionais: [],
  observacoes: "",
}