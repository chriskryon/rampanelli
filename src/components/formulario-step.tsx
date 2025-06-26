"use client"

import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { Plus, Minus, PlusCircle, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { FormData, Item } from "@/types/types"
import { useOrcamento } from "../contexts/orcamento-provider"
import { useClientes } from "../contexts/cliente-provider"

// Modificar todos os labels para texto branco
const Label = ({ ...props }) => <label {...props} className="text-white font-medium mb-1 block" />

export function FormularioStep() {
  const { clientes, buscarClientes, adicionarCliente } = useClientes()
  const {
    setStep,
    formData,
    setFormData,
    itensCatalogo,
    calcularTotal,
    adicionarNovoMaterial,
    adicionarCustoAdicional,
    removerCustoAdicional,
  } = useOrcamento()

  const [itens, setItens] = useState<Item[]>(
    formData.itens.length > 0 ? formData.itens : itensCatalogo.map((item) => ({ ...item })),
  )
  const [maoDeObra, setMaoDeObra] = useState<number>(formData.maoDeObra)
  const [total, setTotal] = useState<number>(0)
  const [novoMaterial, setNovoMaterial] = useState({ nome: "", valor: "" })
  const [novoCusto, setNovoCusto] = useState({ descricao: "", valor: "" })
  const [busca, setBusca] = useState("")
  const [clienteSelecionado, setClienteSelecionado] = useState(null)
  const [showSugestoes, setShowSugestoes] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue, // <-- ADICIONADO
  } = useForm<Omit<FormData, "itens" | "maoDeObra" | "custosAdicionais">>({
    defaultValues: {
      nome: formData.nome,
      telefone: formData.telefone,
      email: formData.email,
      descricao: formData.descricao,
      observacoes: formData.observacoes,
    },
  })

  const router = useRouter()

  useEffect(() => {
    const valorItens = itens.reduce((total, item) => total + item.valor * item.quantidade, 0)
    const valorCustosAdicionais = formData.custosAdicionais.reduce((total, custo) => total + custo.valor, 0)
    setTotal(valorItens + maoDeObra + valorCustosAdicionais)
  }, [itens, maoDeObra, formData.custosAdicionais])

  // Atualizar itens quando o catálogo mudar
  useEffect(() => {
    // Manter as quantidades dos itens já selecionados
    const itensAtualizados = itensCatalogo.map((itemCatalogo) => {
      const itemExistente = itens.find((item) => item.id === itemCatalogo.id)
      return {
        ...itemCatalogo,
        quantidade: itemExistente ? itemExistente.quantidade : 0,
      }
    })
    setItens(itensAtualizados)
  }, [itensCatalogo])

  const sugestoes = buscarClientes(busca)

  function handleSelecionar(cliente) {
    setClienteSelecionado(cliente)
    setFormData({ ...formData, nome: cliente.nome, email: cliente.email, telefone: cliente.telefone })
    setShowSugestoes(false)
  }

  function handleInputChange(e) {
    setBusca(e.target.value)
    setClienteSelecionado(null)
    setFormData({ ...formData, nome: e.target.value })
    setShowSugestoes(true)
  }

  const atualizarQuantidade = (id: number, quantidade: number) => {
    setItens((prevItens) =>
      prevItens.map((item) => (item.id === id ? { ...item, quantidade: Math.max(0, quantidade) } : item)),
    )
  }

  const handleAdicionarMaterial = () => {
    if (novoMaterial.nome.trim() === "" || novoMaterial.valor.trim() === "") {
      return
    }

    const valor = Number.parseFloat(novoMaterial.valor)
    if (isNaN(valor) || valor <= 0) {
      return
    }

    adicionarNovoMaterial(novoMaterial.nome, valor)
    setNovoMaterial({ nome: "", valor: "" })
  }

  const handleAdicionarCusto = () => {
    if (novoCusto.descricao.trim() === "" || novoCusto.valor.trim() === "") {
      return
    }

    const valor = Number.parseFloat(novoCusto.valor)
    if (isNaN(valor) || valor <= 0) {
      return
    }

    adicionarCustoAdicional(novoCusto.descricao, valor)
    setNovoCusto({ descricao: "", valor: "" })
  }

  const onSubmit = (data: Omit<FormData, "itens" | "maoDeObra" | "custosAdicionais">) => {
    const itensSelecionados = itens.filter((item) => item.quantidade > 0)

    setFormData({
      ...formData, // mantém todos os dados anteriores
      ...data, // sobrescreve apenas os campos do formulário
      itens: itensSelecionados,
      maoDeObra: maoDeObra,
      custosAdicionais: formData.custosAdicionais,
    })

    setStep(2)
  }

  return (
    <motion.div
      className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-xl"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold text-white mb-6 font-sfpro">Novo Orçamento</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nome">Nome do Cliente</Label>
          <div className="relative">
            <Input
              id="nome"
              placeholder="Digite o nome completo"
              {...register("nome", { required: "Nome é obrigatório" })}
              className="bg-white/5 border-white/10 focus:border-[#00D4FF]/50 text-white placeholder:text-gray-500"
              onChange={e => {
                setFormData({ ...formData, nome: e.target.value })
                setBusca(e.target.value)
                setClienteSelecionado(null)
                setShowSugestoes(true)
                setValue("nome", e.target.value) // Sincroniza com React Hook Form
              }}
              autoComplete="off"
              onFocus={() => setShowSugestoes(true)}
              onBlur={() => setTimeout(() => setShowSugestoes(false), 200)}
              disabled={!!clienteSelecionado}
            />
            {clienteSelecionado && (
              <button
                type="button"
                className="absolute right-2 top-2 text-xs text-gray-400 hover:text-red-400"
                onClick={() => {
                  setClienteSelecionado(null)
                  setFormData({ ...formData, nome: "", email: "", telefone: "" })
                }}
              >
                Limpar seleção
              </button>
            )}
            {showSugestoes && busca && sugestoes.length > 0 && (
              <ul className="bg-[#18181B] border border-white/10 rounded shadow absolute z-10 w-full mt-1">
                {sugestoes.map((cliente) => (
                  <li
                    key={cliente.id}
                    onClick={() => handleSelecionar(cliente)}
                    className="cursor-pointer hover:bg-[#00D4FF]/10 px-3 py-2 text-white transition-colors"
                  >
                    {cliente.nome} <span className="text-gray-400">({cliente.email})</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {errors.nome && <p className="text-red-500 text-sm">{errors.nome.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="telefone">Telefone</Label>
          <Input
            id="telefone"
            placeholder="(00) 00000-0000"
            {...register("telefone", {
              required: "Telefone é obrigatório",
            })}
            className="bg-white/5 border-white/10 focus:border-[#00D4FF]/50 text-white placeholder:text-gray-500"
            value={formData.telefone}
            disabled={!!clienteSelecionado}
            onChange={(e) => {
              let value = e.target.value.replace(/\D/g, "")
              if (value.length <= 11) {
                value = value.replace(/^(\d{2})(\d)/g, "($1) $2")
                value = value.replace(/(\d)(\d{4})$/, "$1-$2")
                e.target.value = value
              }
              if (!clienteSelecionado) setFormData({ ...formData, telefone: e.target.value })
            }}
          />
          {errors.telefone && <p className="text-red-500 text-sm">{errors.telefone.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            placeholder="cliente@exemplo.com"
            {...register("email", {
              required: "E-mail é obrigatório",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "E-mail inválido",
              },
            })}
            className="bg-white/5 border-white/10 focus:border-[#00D4FF]/50 text-white placeholder:text-gray-500"
            value={formData.email}
            disabled={!!clienteSelecionado}
            onChange={e => {
              if (!clienteSelecionado) setFormData({ ...formData, email: e.target.value })
            }}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="descricao">Nome do Projeto</Label>
          <Input
            id="descricao"
            placeholder="Ex: Reforma da cozinha"
            {...register("descricao", { required: "Descrição é obrigatória" })}
            className="bg-white/5 border-white/10 focus:border-[#00D4FF]/50 text-white placeholder:text-gray-500"
          />
          {errors.descricao && <p className="text-red-500 text-sm">{errors.descricao.message}</p>}
        </div>

        <div className="space-y-2 pt-4 border-t border-white/10">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-white">Materiais</h3>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/20 backdrop-blur-sm hover:bg-[#00D4FF]/20"
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> Novo Material
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#0A0A0B] border-white/10 text-white">
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Material</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="novo-nome">Nome do Material</Label>
                    <Input
                      id="novo-nome"
                      value={novoMaterial.nome}
                      onChange={(e) => setNovoMaterial({ ...novoMaterial, nome: e.target.value })}
                      placeholder="Ex: Chapa MDF"
                      className="bg-white/5 border-white/10 focus:border-[#00D4FF]/50 text-white placeholder:text-gray-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="novo-valor">Valor (R$)</Label>
                    <Input
                      id="novo-valor"
                      value={novoMaterial.valor}
                      onChange={(e) => setNovoMaterial({ ...novoMaterial, valor: e.target.value })}
                      placeholder="Ex: 1000"
                      type="number"
                      min="0"
                      step="0.01"
                      className="bg-white/5 border-white/10 focus:border-[#00D4FF]/50 text-white placeholder:text-gray-500"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      onClick={handleAdicionarMaterial}
                      className="bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/20 backdrop-blur-sm hover:bg-[#00D4FF]/20 transition-all"
                    >
                      Adicionar Material
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {itens.length === 0 ? (
              <div className="bg-white/5 p-3 rounded-md text-gray-400 text-center">Nenhum material disponível</div>
            ) : (
              itens.map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-white/5 p-3 rounded-md">
                  <div className="flex-1 min-w-0">
                    <p className="text-white truncate">{item.nome}</p>
                    <p className="text-sm text-gray-400">R$ {item.valor.toLocaleString("pt-BR")}</p>
                  </div>
                  <div className="flex items-center space-x-2 ml-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full border-white/10 bg-white/5"
                      onClick={() => atualizarQuantidade(item.id, item.quantidade - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center text-white">{item.quantidade}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full border-white/10 bg-white/5"
                      onClick={() => atualizarQuantidade(item.id, item.quantidade + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-2 pt-4 border-t border-white/10">
          <Label htmlFor="maoDeObra">Mão de Obra (Lucro)</Label>
          <div className="flex items-center">
            <span className="bg-white/5 border border-white/10 rounded-l-md px-3 py-2 text-gray-400">R$</span>
            <Input
              id="maoDeObra"
              type="number"
              min="0"
              value={maoDeObra}
              onChange={(e) => setMaoDeObra(Number(e.target.value))}
              className="bg-white/5 border-white/10 focus:border-[#00D4FF]/50 rounded-l-none text-white"
            />
          </div>
        </div>

        <div className="space-y-2 pt-4 border-t border-white/10">
          <div className="flex justify-between items-center">
            <Label htmlFor="custos-adicionais">Custos Adicionais</Label>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/20 backdrop-blur-sm hover:bg-[#00D4FF]/20"
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Custo
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#0A0A0B] border-white/10 text-white">
                <DialogHeader>
                  <DialogTitle>Adicionar Custo Adicional</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="custo-descricao">Descrição</Label>
                    <Input
                      id="custo-descricao"
                      value={novoCusto.descricao}
                      onChange={(e) => setNovoCusto({ ...novoCusto, descricao: e.target.value })}
                      placeholder="Ex: Frete"
                      className="bg-white/5 border-white/10 focus:border-[#00D4FF]/50 text-white placeholder:text-gray-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="custo-valor">Valor (R$)</Label>
                    <Input
                      id="custo-valor"
                      value={novoCusto.valor}
                      onChange={(e) => setNovoCusto({ ...novoCusto, valor: e.target.value })}
                      placeholder="Ex: 250"
                      type="number"
                      min="0"
                      step="0.01"
                      className="bg-white/5 border-white/10 focus:border-[#00D4FF]/50 text-white placeholder:text-gray-500"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      onClick={handleAdicionarCusto}
                      className="bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/20 backdrop-blur-sm hover:bg-[#00D4FF]/20 transition-all"
                    >
                      Adicionar Custo
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
            {formData.custosAdicionais.length === 0 ? (
              <div className="bg-white/5 p-3 rounded-md text-gray-400 text-center">
                Nenhum custo adicional adicionado
              </div>
            ) : (
              formData.custosAdicionais.map((custo, index) => (
                <div key={index} className="flex items-center justify-between bg-white/5 p-3 rounded-md">
                  <div>
                    <p className="text-white">{custo.descricao}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-white">R$ {custo.valor.toLocaleString("pt-BR")}</p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      onClick={() => removerCustoAdicional(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="valor">Valor Total</Label>
          <Input
            id="valor"
            value={`R$ ${total.toLocaleString("pt-BR")}`}
            readOnly
            className="bg-white/5 border-white/10 text-[#00D4FF] font-bold placeholder:text-gray-400"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="observacoes">Observações</Label>
          <Textarea
            id="observacoes"
            {...register("observacoes")}
            className="bg-white/5 border-white/10 focus:border-[#00D4FF]/50 min-h-[100px] text-white placeholder:text-gray-400"
          />
        </div>

        <div className="pt-4 flex flex-wrap gap-2">
          <Button
            type="submit"
            className="bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/20 backdrop-blur-sm hover:bg-[#00D4FF]/20 transition-all"
          >
            Próximo
          </Button>

          <Button
            type="button"
            onClick={() => router.push("/")}
            variant="outline"
            className="border-white/20 hover:bg-white/5 text-white"
          >
            Cancelar
          </Button>
        </div>
      </form>
    </motion.div>
  )
}
