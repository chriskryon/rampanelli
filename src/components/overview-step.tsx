"use client"

import { useOrcamento } from "../contexts/orcamento-provider"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export function OverviewStep() {
  const { setStep, formData, calcularTotal } = useOrcamento()

  const valorTotal = calcularTotal()
  const valorItens = formData.itens.reduce((total, item) => total + item.valor * item.quantidade, 0)
  const valorCustosAdicionais = formData.custosAdicionais.reduce((total, custo) => total + custo.valor, 0)

  return (
    <motion.div
      className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-xl"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold text-white mb-6 font-sfpro">Confirmação do Orçamento</h2>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-400">Nome do Cliente</h3>
            <p className="text-white">{formData.nome}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-400">Telefone</h3>
            <p className="text-white">{formData.telefone}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-400">E-mail</h3>
            <p className="text-white">{formData.email}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-400">Nome do Projeto</h3>
            <p className="text-white">{formData.descricao}</p>
          </div>
        </div>

        <div className="border-t border-white/10 pt-4">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Materiais</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {formData.itens.map((item) => (
              <div key={item.id} className="flex justify-between bg-white/5 p-3 rounded-md">
                <div>
                  <p className="text-white">{item.nome}</p>
                </div>
                <div className="text-right">
                  <p className="text-white">
                    {item.quantidade} x R$ {item.valor.toLocaleString("pt-BR")}
                  </p>
                  <p className="text-sm text-gray-400">R$ {(item.quantidade * item.valor).toLocaleString("pt-BR")}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {formData.custosAdicionais.length > 0 && (
          <div className="border-t border-white/10 pt-4">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Custos Adicionais</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
              {formData.custosAdicionais.map((custo, index) => (
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
          <div className="grid grid-cols-1 gap-2">
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
              <p className="text-green-500">R$ {formData.maoDeObra.toLocaleString("pt-BR")}</p>
            </div>

            <div className="flex justify-between pt-2 border-t border-white/10">
              <h3 className="font-medium text-white">Valor Total</h3>
              <p className="text-[#00D4FF] font-bold">R$ {valorTotal.toLocaleString("pt-BR")}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-4">
          <h3 className="text-sm font-medium text-gray-400">Observações</h3>
          <p className="text-white whitespace-pre-line">{formData.observacoes}</p>
        </div>

        <div className="flex gap-4 pt-4">
          <Button onClick={() => setStep(1)} variant="outline" className="flex-1 border-white/20 hover:bg-white/5">
            Voltar
          </Button>

          <Button
            onClick={() => setStep(3)}
            className="flex-1 bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/20 backdrop-blur-sm hover:bg-[#00D4FF]/20 transition-all"
          >
            Confirmar
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
