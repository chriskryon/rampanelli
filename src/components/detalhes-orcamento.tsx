"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ArrowLeft, Download, FileText, Pencil } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Orcamento, StatusOrcamento } from "@/types/types"
import { useOrcamento } from "../contexts/orcamento-provider"
import { gerarPDFInternoUtil, gerarPDFClienteUtil } from "@/lib/pdf-utils"
import { PDFDownloadLink } from "@react-pdf/renderer"
import { OrcamentoPDFCliente } from "@/lib/OrcamentoPDFCliente"
import { OrcamentoPDFInterno } from "@/lib/OrcamentoPDFInterno"

export function DetalhesOrcamento({ id }: { id: string }) {
  const router = useRouter()
  const { orcamentos, atualizarOrcamento } = useOrcamento()
  const [orcamento, setOrcamento] = useState<Orcamento | null>(null)

  useEffect(() => {
    if (id && orcamentos.length > 0) {
      const orcamentoEncontrado = orcamentos.find((o) => o.id === id)
      if (orcamentoEncontrado) {
        setOrcamento(orcamentoEncontrado)
      } else {
        // Apenas redirecione se realmente não encontrar o orçamento
        console.error(`Orçamento com ID ${id} não encontrado`)
        router.push("/orcamentos")
      }
    }
  }, [id, orcamentos, router])

  if (!orcamento) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00D4FF]"></div>
      </div>
    )
  }

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

  const handleStatusChange = (status: StatusOrcamento) => {
    atualizarOrcamento(id, { status })
    setOrcamento({ ...orcamento, status })
  }

  const valorItens = orcamento.itens.reduce((total, item) => total + item.valor * item.quantidade, 0)
  const valorCustosAdicionais = orcamento.custosAdicionais
    ? orcamento.custosAdicionais.reduce((total, custo) => total + custo.valor, 0)
    : 0

  // Função para gerar PDF interno com estilo minimalista de nota fiscal
  const gerarPDFInterno = async () => {
    if (!orcamento) return
    const pdfBytes = await gerarPDFInternoUtil(orcamento)
    const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `Orcamento_Interno_${orcamento.nome.replace(/\s+/g, "_")}.pdf`
    link.click()
  }

  // Função para gerar PDF para cliente com estilo minimalista de nota fiscal
  const gerarPDFCliente = async () => {
    if (!orcamento) return
    const pdfBytes = await gerarPDFClienteUtil(orcamento)
    const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `Orcamento_${orcamento.nome.replace(/\s+/g, "_")}.pdf`
    link.click()
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Link href="/orcamentos">
            <Button variant="outline" size="icon" className="border-white/10 hover:bg-white/5">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-white font-sfpro">Detalhes do Orçamento</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={gerarPDFInterno}
            className="bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all"
          >
            <Download className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">PDF Interno</span>
            <span className="sm:hidden">Interno</span>
          </Button>
          <Button
            onClick={gerarPDFCliente}
            className="bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/20 backdrop-blur-sm hover:bg-[#00D4FF]/20 transition-all"
          >
            <Download className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">PDF Cliente</span>
            <span className="sm:hidden">Cliente</span>
          </Button>
          <Button
            onClick={() => router.push(`/editar-orcamento/${id}`)}
            className="bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all"
          >
            <Pencil className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Editar</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-black/30 backdrop-blur-xl border-white/10 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-white text-xl flex justify-between items-center">
              <span>{orcamento.descricao}</span>
              <div className="flex items-center gap-2">
                <Select
                  value={orcamento.status}
                  onValueChange={(value) => handleStatusChange(value as StatusOrcamento)}
                >
                  <SelectTrigger className="w-[180px] bg-transparent border-white/10">
                    {getStatusBadge(orcamento.status)}
                  </SelectTrigger>
                  <SelectContent className="bg-[#0A0A0B] border-white/10 text-white">
                    <SelectItem value="pendente">
                      <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                        Pendente
                      </Badge>
                    </SelectItem>
                    <SelectItem value="aprovado">
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                        Aprovado
                      </Badge>
                    </SelectItem>
                    <SelectItem value="rejeitado">
                      <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                        Rejeitado
                      </Badge>
                    </SelectItem>
                    <SelectItem value="em_andamento">
                      <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">
                        Em andamento
                      </Badge>
                    </SelectItem>
                    <SelectItem value="concluido">
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                        Concluído
                      </Badge>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-400">Data</h3>
                <p className="text-white">
                  {format(new Date(orcamento.data), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-400">ID</h3>
                <p className="text-white">#{orcamento.id.padStart(5, "0")}</p>
              </div>
            </div>

            <div className="border-t border-white/10 pt-4">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Informações do Cliente</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="text-xs text-gray-500">Nome</h4>
                  <p className="text-white">{orcamento.nome}</p>
                </div>
                <div>
                  <h4 className="text-xs text-gray-500">Telefone</h4>
                  <p className="text-white">{orcamento.telefone}</p>
                </div>
                <div>
                  <h4 className="text-xs text-gray-500">E-mail</h4>
                  <p className="text-white">{orcamento.email}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-4">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Materiais</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {orcamento.itens.map((item) => (
                  <div key={item.id} className="flex justify-between bg-white/5 p-3 rounded-md">
                    <div>
                      <p className="text-white">{item.nome}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white">
                        {item.quantidade} x R$ {item.valor.toLocaleString("pt-BR")}
                      </p>
                      <p className="text-sm text-gray-400">
                        R$ {(item.quantidade * item.valor).toLocaleString("pt-BR")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {orcamento.custosAdicionais && orcamento.custosAdicionais.length > 0 && (
              <div className="border-t border-white/10 pt-4">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Custos Adicionais</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                  {orcamento.custosAdicionais.map((custo, index) => (
                    <div key={index} className="flex justify-between bg-white/5 p-3 rounded-md">
                      <div>
                        <p className="text-white">{custo.descricao}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white">R$ {custo.valor.toLocaleString("pt-BR")}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-white/10 pt-4">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Observações</h3>
              <p className="text-white whitespace-pre-line bg-white/5 p-3 rounded-md">{orcamento.observacoes}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/30 backdrop-blur-xl border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-xl">Resumo Financeiro</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <h3 className="text-sm font-medium text-gray-400">Subtotal Materiais</h3>
              <p className="text-white">R$ {valorItens.toLocaleString("pt-BR")}</p>
            </div>

            {valorCustosAdicionais > 0 && (
              <div className="flex justify-between">
                <h3 className="text-sm font-medium text-gray-400">Custos Adicionais</h3>
                <p className="text-white">R$ {valorCustosAdicionais.toLocaleString("pt-BR")}</p>
              </div>
            )}

            <div className="flex justify-between">
              <h3 className="text-sm font-medium text-gray-400">Mão de Obra (Lucro)</h3>
              <p className="text-green-500">R$ {orcamento.maoDeObra.toLocaleString("pt-BR")}</p>
            </div>

            <div className="flex justify-between pt-2 border-t border-white/10">
              <h3 className="font-medium text-white">Valor Total</h3>
              <p className="text-[#00D4FF] font-bold">R$ {orcamento.valorTotal.toLocaleString("pt-BR")}</p>
            </div>

            <div className="pt-4 space-y-2">
              <PDFDownloadLink
                document={<OrcamentoPDFCliente orcamento={orcamento} />}
                fileName={`Orcamento_${orcamento.nome.replace(/\s+/g, "_")}.pdf`}
                className="w-full bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/20 backdrop-blur-sm hover:bg-[#00D4FF]/20 transition-all flex items-center justify-center gap-2 px-4 py-2 rounded"
              >
                {({ loading }) => (
                  <>
                    <FileText className="h-4 w-4" />
                    {loading ? "Gerando PDF..." : "Gerar PDF para Cliente"}
                  </>
                )}
              </PDFDownloadLink>
              <PDFDownloadLink
                document={<OrcamentoPDFInterno orcamento={orcamento} />}
                fileName={`Orcamento_Interno_${orcamento.nome.replace(/\s+/g, "_")}.pdf`}
                className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all flex items-center justify-center gap-2 px-4 py-2 rounded"
              >
                {({ loading }) => (
                  <>
                    <FileText className="h-4 w-4" />
                    {loading ? "Gerando PDF..." : "Gerar PDF Interno"}
                  </>
                )}
              </PDFDownloadLink>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
