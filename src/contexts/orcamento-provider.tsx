"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { defaultFormData, FormData, Item, Orcamento, StatusOrcamento } from "@/types/types"
import { defaultItensCatalogo, mockOrcamentos } from "@/mocks/mock-data"
import {
  getOrcamentos,
  createOrcamento,
  updateOrcamento as apiUpdateOrcamento,
  deleteOrcamento as apiDeleteOrcamento,
} from "@/services/orcamento-api"

type OrcamentoContextType = {
  step: number
  setStep: (step: number) => void
  formData: FormData
  setFormData: (data: FormData) => void
  itensCatalogo: Item[]
  setItensCatalogo: (itens: Item[]) => void
  orcamentos: Orcamento[]
  setOrcamentos: (orcamentos: Orcamento[]) => void
  adicionarOrcamento: (orcamento: Orcamento) => void
  atualizarOrcamento: (id: string, dados: Partial<Orcamento>) => void
  calcularTotal: () => number
  adicionarNovoMaterial: (nome: string, valor: number) => void
  adicionarCustoAdicional: (descricao: string, valor: number) => void
  removerCustoAdicional: (index: number) => void
}

const OrcamentoContext = createContext<OrcamentoContextType | undefined>(undefined)

export function OrcamentoProvider({ children }: { children: React.ReactNode }) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>(defaultFormData)
  const [itensCatalogo, setItensCatalogo] = useState<Item[]>(defaultItensCatalogo)
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([])
  const [dadosCarregados, setDadosCarregados] = useState(false)

  // Carregar dados do localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && !dadosCarregados) {
      const savedItens = localStorage.getItem("itensCatalogo")
      const savedOrcamentos = localStorage.getItem("orcamentos")

      if (savedItens) {
        setItensCatalogo(JSON.parse(savedItens))
      }

      if (savedOrcamentos) {
        const orcamentosSalvos = JSON.parse(savedOrcamentos)

        // Adicionar custosAdicionais se não existir nos orçamentos salvos
        const orcamentosAtualizados = orcamentosSalvos.map((orcamento: any) => ({
          ...orcamento,
          custosAdicionais: orcamento.custosAdicionais || [],
        }))

        setOrcamentos(orcamentosAtualizados)
      } else {
        // Se não houver orçamentos salvos, carregue os dados de mock
        // Garantir que os dados de mock tenham custosAdicionais
        const mockAtualizados = mockOrcamentos.map((orcamento) => ({
          ...orcamento,
          custosAdicionais: orcamento.custosAdicionais || [],
        }))
        setOrcamentos(mockAtualizados)
      }

      setDadosCarregados(true)
    }
  }, [dadosCarregados])

  // Salvar dados no localStorage quando mudam
  useEffect(() => {
    if (typeof window !== "undefined" && dadosCarregados) {
      localStorage.setItem("itensCatalogo", JSON.stringify(itensCatalogo))
    }
  }, [itensCatalogo, dadosCarregados])

  useEffect(() => {
    if (typeof window !== "undefined" && dadosCarregados) {
      localStorage.setItem("orcamentos", JSON.stringify(orcamentos))
    }
  }, [orcamentos, dadosCarregados])

  useEffect(() => {
    if (!dadosCarregados) {
      getOrcamentos().then((data) => {
        setOrcamentos(data)
        setDadosCarregados(true)
      })
    }
  }, [dadosCarregados])

  const calcularTotal = () => {
    const valorItens = formData.itens.reduce((total, item) => total + item.valor * item.quantidade, 0)
    const valorCustosAdicionais = formData.custosAdicionais.reduce((total, custo) => total + custo.valor, 0)
    return valorItens + formData.maoDeObra + valorCustosAdicionais
  }

  const adicionarOrcamento = async (orcamento: Orcamento) => {
    const orcamentoCompleto = {
      ...orcamento,
      status: orcamento.status || ("pendente" as StatusOrcamento),
      custosAdicionais: orcamento.custosAdicionais || [],
    }
    await createOrcamento(orcamentoCompleto)
    setOrcamentos((prev) => [...prev, orcamentoCompleto])
  }

  const atualizarOrcamento = async (id: string, dados: Partial<Orcamento>) => {
    const atualizado = await apiUpdateOrcamento(id, dados)
    if (atualizado) {
      setOrcamentos((prev) => prev.map((orcamento) => (orcamento.id === id ? atualizado : orcamento)))
    }
  }

  const excluirOrcamento = async (id: string) => {
    const ok = await apiDeleteOrcamento(id)
    if (ok) {
      setOrcamentos((prev) => prev.filter((o) => o.id !== id))
    }
  }

  const adicionarNovoMaterial = (nome: string, valor: number) => {
    const novoId = itensCatalogo.length > 0 ? Math.max(...itensCatalogo.map((item) => item.id)) + 1 : 1

    const novoItem: Item = {
      id: novoId,
      nome,
      valor,
      quantidade: 0,
    }

    setItensCatalogo((prev) => [...prev, novoItem])

    // Adicionar o novo item à lista de itens do formulário atual
    setFormData((prev) => ({
      ...prev,
      itens: [...prev.itens, { ...novoItem, quantidade: 1 }],
    }))
  }

  const adicionarCustoAdicional = (descricao: string, valor: number) => {
    setFormData((prev) => ({
      ...prev,
      custosAdicionais: [...prev.custosAdicionais, { descricao, valor }],
    }))
  }

  const removerCustoAdicional = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      custosAdicionais: prev.custosAdicionais.filter((_, i) => i !== index),
    }))
  }

  return (
    <OrcamentoContext.Provider
      value={{
        step,
        setStep,
        formData,
        setFormData,
        itensCatalogo,
        setItensCatalogo,
        orcamentos,
        setOrcamentos,
        adicionarOrcamento,
        atualizarOrcamento,
        calcularTotal,
        adicionarNovoMaterial,
        adicionarCustoAdicional,
        removerCustoAdicional,
      }}
    >
      {children}
    </OrcamentoContext.Provider>
  )
}

export function useOrcamento() {
  const context = useContext(OrcamentoContext)
  if (context === undefined) {
    throw new Error("useOrcamento must be used within an OrcamentoProvider")
  }
  return context
}
