"use client"

import { useOrcamento } from "../contexts/orcamento-provider"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { PDFDocument, rgb, StandardFonts } from "pdf-lib"
import { Download, FileText, RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"
import { PDFDownloadLink } from "@react-pdf/renderer"
import { OrcamentoPDFInterno } from "@/lib/OrcamentoPDFInterno"
import { OrcamentoPDFCliente } from "@/lib/OrcamentoPDFCliente"
import type { Orcamento } from "@/types/types"

export function ConfirmacaoStep() {
  const router = useRouter()
  const { setStep, formData, setFormData, calcularTotal, adicionarOrcamento } = useOrcamento()

  const valorTotal = calcularTotal()
  const valorItens = formData.itens.reduce((total, item) => total + item.valor * item.quantidade, 0)
  const valorCustosAdicionais = formData.custosAdicionais.reduce((total, custo) => total + custo.valor, 0)

  const resetForm = () => {
    setFormData({
      nome: "",
      telefone: "",
      email: "",
      descricao: "",
      itens: [],
      maoDeObra: 0,
      custosAdicionais: [],
      observacoes: "Metade na assinatura do contrato, metade na entrega. Prazo de entrega em 15 dias úteis.",
    })
    setStep(1)
  }

  const salvarOrcamento = () => {
    const novoOrcamento = {
      id: Date.now().toString(),
      data: new Date().toISOString(),
      nome: formData.nome,
      telefone: formData.telefone,
      email: formData.email,
      descricao: formData.descricao,
      itens: formData.itens,
      maoDeObra: formData.maoDeObra,
      custosAdicionais: formData.custosAdicionais,
      observacoes: formData.observacoes,
      valorTotal: valorTotal,
      status: "pendente" as const,
    }

    adicionarOrcamento(novoOrcamento)
    router.push("/")
  }

  const orcamentoParaPDF: Orcamento = {
    ...formData,
    id: crypto.randomUUID(),
    data: new Date().toISOString(),
    valorTotal: calcularTotal(),
    status: "pendente"
  }

  return (
    <motion.div
      className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-xl"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-[#00D4FF]/20 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <FileText className="w-10 h-10 text-[#00D4FF]" />
        </motion.div>

        <h2 className="text-2xl font-bold text-white mb-2 font-sfpro">Orçamento gerado com sucesso!</h2>
        <p className="text-gray-400">Você pode baixar os PDFs abaixo</p>
      </div>

      <div className="space-y-4">
        <PDFDownloadLink
          document={<OrcamentoPDFInterno orcamento={orcamentoParaPDF} />}
          fileName={`Orcamento_Interno_${formData.nome.replace(/\s+/g, "_")}.pdf`}
        >
          {({ loading }) =>
            <Button className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all flex items-center justify-center gap-2">
              <Download className="w-4 h-4" />
              {loading ? "Gerando PDF..." : "PDF Interno (com lucro)"}
            </Button>
          }
        </PDFDownloadLink>

        <PDFDownloadLink
          document={<OrcamentoPDFCliente orcamento={orcamentoParaPDF} />}
          fileName={`Orcamento_${formData.nome.replace(/\s+/g, "_")}.pdf`}
        >
          {({ loading }) =>
            <Button className="w-full bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/20 backdrop-blur-sm hover:bg-[#00D4FF]/20 transition-all flex items-center justify-center gap-2">
              <Download className="w-4 h-4" />
              {loading ? "Gerando PDF..." : "PDF Cliente"}
            </Button>
          }
        </PDFDownloadLink>

        <Button
          onClick={salvarOrcamento}
          className="w-full bg-green-500/10 text-green-500 border border-green-500/20 backdrop-blur-sm hover:bg-green-500/20 transition-all flex items-center justify-center gap-2 mt-4"
        >
          <FileText className="w-4 h-4" />
          Salvar e Voltar ao Dashboard
        </Button>

        <Button
          onClick={resetForm}
          variant="outline"
          className="w-full mt-2 border-white/20 hover:bg-white/5 flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Novo Orçamento
        </Button>
      </div>
    </motion.div>
  )
}
