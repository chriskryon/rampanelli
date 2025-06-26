"use client"

import { useOrcamento } from "../contexts/orcamento-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, DollarSign, TrendingUp, Calendar, Users, CheckCircle, XCircle, Clock } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { StatusOrcamento } from "@/types/types"

export function Dashboard() {
  const { orcamentos } = useOrcamento()

  // Calcular estatísticas
  const valorTotal = orcamentos.reduce((total, orcamento) => total + orcamento.valorTotal, 0)
  const lucroTotal = orcamentos.reduce((total, orcamento) => total + orcamento.maoDeObra, 0)
  const mediaOrcamento = orcamentos.length > 0 ? valorTotal / orcamentos.length : 0
  const totalClientes = new Set(orcamentos.map((o) => o.email)).size

  // Estatísticas por status
  const orcamentosAprovados = orcamentos.filter((o) => o.status === "aprovado" || o.status === "concluido").length
  const orcamentosRejeitados = orcamentos.filter((o) => o.status === "rejeitado").length
  const orcamentosPendentes = orcamentos.filter((o) => o.status === "pendente").length

  // Ordenar orçamentos por data (mais recentes primeiro)
  const orcamentosRecentes = [...orcamentos]
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
    .slice(0, 5)

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

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white font-sfpro">Dashboard</h1>
        <Link href="/novo-orcamento">
          <Button className="bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/20 backdrop-blur-sm hover:bg-[#00D4FF]/20 transition-all">
            Novo Orçamento
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card className="bg-black/30 backdrop-blur-xl border-white/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-white text-lg font-medium">Valor Total</CardTitle>
              <DollarSign className="h-5 w-5 text-[#00D4FF]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">R$ {valorTotal.toLocaleString("pt-BR")}</div>
              <p className="text-xs text-gray-400 mt-1">Total de todos os orçamentos</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="bg-black/30 backdrop-blur-xl border-white/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-white text-lg font-medium">Lucro Estimado</CardTitle>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">R$ {lucroTotal.toLocaleString("pt-BR")}</div>
              <p className="text-xs text-gray-400 mt-1">Total de mão de obra</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="bg-black/30 backdrop-blur-xl border-white/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-white text-lg font-medium">Média por Orçamento</CardTitle>
              <Calendar className="h-5 w-5 text-[#00D4FF]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">R$ {mediaOrcamento.toLocaleString("pt-BR")}</div>
              <p className="text-xs text-gray-400 mt-1">Valor médio por orçamento</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="bg-black/30 backdrop-blur-xl border-white/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-white text-lg font-medium">Total de Clientes</CardTitle>
              <Users className="h-5 w-5 text-[#00D4FF]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalClientes}</div>
              <p className="text-xs text-gray-400 mt-1">Clientes únicos</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="md:col-span-2"
        >
          <Card className="bg-black/30 backdrop-blur-xl border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-xl">Orçamentos Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              {orcamentosRecentes.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-400">Nenhum orçamento encontrado</p>
                  <Link href="/novo-orcamento" className="mt-4 inline-block">
                    <Button className="mt-4 bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/20 backdrop-blur-sm hover:bg-[#00D4FF]/20 transition-all">
                      Criar Primeiro Orçamento
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orcamentosRecentes.map((orcamento) => (
                    <Link href={`/orcamentos/${orcamento.id}`} key={orcamento.id}>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white/5 rounded-lg p-4 mt-2 border border-white/10 hover:border-white/20 transition-all"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-white">{orcamento.descricao}</h3>
                            <p className="text-sm text-gray-400">{orcamento.nome}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {format(new Date(orcamento.data), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-[#00D4FF] font-bold">
                              R$ {orcamento.valorTotal.toLocaleString("pt-BR")}
                            </p>
                            <div className="mt-1">{getStatusBadge(orcamento.status)}</div>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                  <div className="pt-2 text-center">
                    <Link href="/orcamentos">
                      <Button variant="outline" className="btn-outline-white">
                        Ver todos os orçamentos
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="bg-black/30 backdrop-blur-xl border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-xl">Status dos Orçamentos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mr-4">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className="text-white font-medium">Aprovados</h3>
                      <span className="text-green-500 font-bold">{orcamentosAprovados}</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${orcamentos.length ? (orcamentosAprovados / orcamentos.length) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center mr-4">
                    <Clock className="h-6 w-6 text-yellow-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className="text-white font-medium">Pendentes</h3>
                      <span className="text-yellow-500 font-bold">{orcamentosPendentes}</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{ width: `${orcamentos.length ? (orcamentosPendentes / orcamentos.length) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mr-4">
                    <XCircle className="h-6 w-6 text-red-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className="text-white font-medium">Rejeitados</h3>
                      <span className="text-red-500 font-bold">{orcamentosRejeitados}</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{
                          width: `${orcamentos.length ? (orcamentosRejeitados / orcamentos.length) * 100 : 0}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 text-center">
                  <Link href="/orcamentos">
                    <Button className="bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/20 backdrop-blur-sm hover:bg-[#00D4FF]/20 transition-all w-full">
                      Gerenciar Orçamentos
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
