"use client"

import { useState } from "react"
import { useOrcamento } from "../contexts/orcamento-provider"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { FileText, MoreVertical, Search, Download, Eye, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useRouter } from "next/navigation"
import { mockOrcamentos } from "@/mocks/mock-data"
import { StatusOrcamento } from "@/types/types"

export function ListaOrcamentos() {
  const router = useRouter()
  const { orcamentos, atualizarOrcamento, setOrcamentos } = useOrcamento()
  const [filtro, setFiltro] = useState("")
  const [statusFiltro, setStatusFiltro] = useState<string>("todos")

  // Filtrar orçamentos
  const orcamentosFiltrados = orcamentos.filter((orcamento) => {
    const matchesSearch =
      orcamento.nome.toLowerCase().includes(filtro.toLowerCase()) ||
      orcamento.descricao.toLowerCase().includes(filtro.toLowerCase()) ||
      orcamento.email.toLowerCase().includes(filtro.toLowerCase())

    const matchesStatus = statusFiltro === "todos" || orcamento.status === statusFiltro

    return matchesSearch && matchesStatus
  })

  // Ordenar orçamentos por data (mais recentes primeiro)
  const orcamentosOrdenados = [...orcamentosFiltrados].sort(
    (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime(),
  )

  const getStatusBadge = (status: StatusOrcamento) => {
    switch (status) {
      case "pendente":
        return (
          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
            Pendente
          </Badge>
        )
      case "aprovado":
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
            Aprovado
          </Badge>
        )
      case "rejeitado":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
            Rejeitado
          </Badge>
        )
      case "em_andamento":
        return (
          <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">
            Em andamento
          </Badge>
        )
      case "concluido":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
            Concluído
          </Badge>
        )
      default:
        return <Badge variant="outline">Desconhecido</Badge>
    }
  }

  const atualizarStatus = (id: string, status: StatusOrcamento) => {
    atualizarOrcamento(id, { status })
  }

  const excluirOrcamento = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este orçamento?")) {
      setOrcamentos(orcamentos.filter((o) => o.id !== id))
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-white font-sfpro">Orçamentos</h1>
        <Link href="/novo-orcamento">
          <Button className="bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/20 backdrop-blur-sm hover:bg-[#00D4FF]/20 transition-all w-full sm:w-auto">
            Novo Orçamento
          </Button>
        </Link>
      </div>

      <Card className="bg-black/30 backdrop-blur-xl border-white/10 p-4 sm:p-6">
        <div className="flex flex-col gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar orçamentos..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 focus:border-[#00D4FF]/50 text-white placeholder:text-gray-500"
            />
          </div>
          <Select value={statusFiltro} onValueChange={setStatusFiltro}>
            <SelectTrigger className="bg-white/5 border-white/10">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-[#0A0A0B] border-white/10 text-white">
              <SelectItem value="todos">Todos os status</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="aprovado">Aprovado</SelectItem>
              <SelectItem value="rejeitado">Rejeitado</SelectItem>
              <SelectItem value="em_andamento">Em andamento</SelectItem>
              <SelectItem value="concluido">Concluído</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {orcamentosOrdenados.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400">Nenhum orçamento encontrado</p>
            <Link href="/novo-orcamento" className="mt-4 inline-block">
              <Button className="mt-4 bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/20 backdrop-blur-sm hover:bg-[#00D4FF]/20 transition-all">
                Criar Primeiro Orçamento
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-gray-400 min-w-[100px]">Data</TableHead>
                  <TableHead className="text-gray-400 min-w-[150px]">Cliente</TableHead>
                  <TableHead className="text-gray-400 min-w-[200px] hidden sm:table-cell">Projeto</TableHead>
                  <TableHead className="text-gray-400 min-w-[120px]">Valor</TableHead>
                  <TableHead className="text-gray-400 min-w-[120px]">Status</TableHead>
                  <TableHead className="text-gray-400 text-right min-w-[80px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orcamentosOrdenados.map((orcamento) => (
                  <motion.tr
                    key={orcamento.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-white/10 hover:bg-white/5"
                  >
                    <TableCell className="text-white text-sm">
                      {format(new Date(orcamento.data), "dd/MM/yyyy", { locale: ptBR })}
                    </TableCell>
                    <TableCell className="text-white">
                      <div className="min-w-0">
                        <p className="font-medium truncate">{orcamento.nome}</p>
                        <p className="text-xs text-gray-400 truncate">{orcamento.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-white hidden sm:table-cell">
                      <div className="max-w-[200px] truncate" title={orcamento.descricao}>
                        {orcamento.descricao}
                      </div>
                    </TableCell>
                    <TableCell className="text-[#00D4FF] font-medium text-sm">
                      R$ {orcamento.valorTotal.toLocaleString("pt-BR")}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 p-0 hover:bg-transparent">
                            {getStatusBadge(orcamento.status)}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-[#0A0A0B] border-white/10 text-white">
                          <DropdownMenuLabel>Alterar status</DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-white/10" />
                          <DropdownMenuItem
                            onClick={() => atualizarStatus(orcamento.id, "pendente")}
                            className="hover:bg-white/5 cursor-pointer"
                          >
                            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                              Pendente
                            </Badge>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => atualizarStatus(orcamento.id, "aprovado")}
                            className="hover:bg-white/5 cursor-pointer"
                          >
                            <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                              Aprovado
                            </Badge>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => atualizarStatus(orcamento.id, "rejeitado")}
                            className="hover:bg-white/5 cursor-pointer"
                          >
                            <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                              Rejeitado
                            </Badge>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => atualizarStatus(orcamento.id, "em_andamento")}
                            className="hover:bg-white/5 cursor-pointer"
                          >
                            <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">
                              Em andamento
                            </Badge>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => atualizarStatus(orcamento.id, "concluido")}
                            className="hover:bg-white/5 cursor-pointer"
                          >
                            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                              Concluído
                            </Badge>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-white/5">
                            <span className="sr-only">Abrir menu</span>
                            <MoreVertical className="h-4 w-4 text-gray-400" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[#0A0A0B] border-white/10 text-white">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-white/10" />
                          <DropdownMenuItem
                            onClick={() => {
                              window.location.href = `/orcamentos/${orcamento.id}`
                            }}
                            className="hover:bg-white/5 cursor-pointer"
                          >
                            <Eye className="mr-2 h-4 w-4" /> Ver detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              window.location.href = `/editar-orcamento/${orcamento.id}`
                            }}
                            className="hover:bg-white/5 cursor-pointer"
                          >
                            <Edit className="mr-2 h-4 w-4" /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              window.location.href = `/orcamentos/${orcamento.id}`
                            }}
                            className="hover:bg-white/5 cursor-pointer"
                          >
                            <Download className="mr-2 h-4 w-4" /> Gerar PDF
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-white/10" />
                          <DropdownMenuItem
                            onClick={() => excluirOrcamento(orcamento.id)}
                            className="text-red-500 hover:bg-red-500/10 cursor-pointer"
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  )
}
