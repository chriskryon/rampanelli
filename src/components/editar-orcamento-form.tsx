"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Plus, Minus, PlusCircle, X, ArrowLeft, Save } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useOrcamento } from "../contexts/orcamento-provider"
import { FormData, Item, Orcamento } from "@/types/types"

export function EditarOrcamentoForm({ id }: { id: string }) {
  const router = useRouter()
  const { toast } = useToast()
  const { orcamentos, atualizarOrcamento, itensCatalogo, adicionarNovoMaterial } = useOrcamento()
  const [orcamento, setOrcamento] = useState<Orcamento | null>(null)
  const [itens, setItens] = useState<Item[]>([])
  const [maoDeObra, setMaoDeObra] = useState<number>(0)
  const [custosAdicionais, setCustosAdicionais] = useState<{ descricao: string; valor: number }[]>([])
  const [total, setTotal] = useState<number>(0)
  const [novoMaterial, setNovoMaterial] = useState({ nome: "", valor: "" })
  const [novoCusto, setNovoCusto] = useState({ descricao: "", valor: "" })
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Omit<FormData, "itens" | "maoDeObra" | "custosAdicionais">>()

  // Carregar dados do orçamento
  useEffect(() => {
    if (id && orcamentos.length > 0) {
      const orcamentoEncontrado = orcamentos.find((o) => o.id === id)
      if (orcamentoEncontrado) {
        setOrcamento(orcamentoEncontrado)

        // Preencher o formulário com os dados do orçamento
        setValue("nome", orcamentoEncontrado.nome)
        setValue("telefone", orcamentoEncontrado.telefone)
        setValue("email", orcamentoEncontrado.email)
        setValue("descricao", orcamentoEncontrado.descricao)
        setValue("observacoes", orcamentoEncontrado.observacoes)

        // Preparar itens para edição
        const itensCompletos = itensCatalogo.map((itemCatalogo) => {
          const itemExistente = orcamentoEncontrado.itens.find((item) => item.id === itemCatalogo.id)
          return {
            ...itemCatalogo,
            quantidade: itemExistente ? itemExistente.quantidade : 0,
          }
        })

        // Adicionar itens que estão no orçamento mas não estão no catálogo
        orcamentoEncontrado.itens.forEach((item) => {
          if (!itensCompletos.some((i) => i.id === item.id)) {
            itensCompletos.push(item)
          }
        })

        setItens(itensCompletos)
        setMaoDeObra(orcamentoEncontrado.maoDeObra)
        setCustosAdicionais(orcamentoEncontrado.custosAdicionais || [])
      } else {
        router.push("/orcamentos")
      }
    }
  }, [id, orcamentos, setValue, router, itensCatalogo])

  // Calcular total
  useEffect(() => {
    const valorItens = itens.reduce((total, item) => total + item.valor * item.quantidade, 0)
    const valorCustosAdicionais = custosAdicionais.reduce((total, custo) => total + custo.valor, 0)
    setTotal(valorItens + maoDeObra + valorCustosAdicionais)
  }, [itens, maoDeObra, custosAdicionais])

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

    setCustosAdicionais([...custosAdicionais, { descricao: novoCusto.descricao, valor }])
    setNovoCusto({ descricao: "", valor: "" })
  }

  const removerCustoAdicional = (index: number) => {
    setCustosAdicionais(custosAdicionais.filter((_, i) => i !== index))
  }

  const onSubmit = (data: Omit<FormData, "itens" | "maoDeObra" | "custosAdicionais">) => {
    if (!orcamento) return

    setIsLoading(true)

    const itensSelecionados = itens.filter((item) => item.quantidade > 0)

    const orcamentoAtualizado: Partial<Orcamento> = {
      nome: data.nome,
      telefone: data.telefone,
      email: data.email,
      descricao: data.descricao,
      observacoes: data.observacoes,
      itens: itensSelecionados,
      maoDeObra: maoDeObra,
      custosAdicionais: custosAdicionais,
      valorTotal: total,
    }

    // Simular um atraso para mostrar o loading
    setTimeout(() => {
      atualizarOrcamento(id, orcamentoAtualizado)

      toast({
        title: "Orçamento atualizado",
        description: "As alterações foram salvas com sucesso.",
        duration: 3000,
      })

      setIsLoading(false)
      router.push(`/orcamentos/${id}`)
    }, 1000)
  }

  if (!orcamento) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#030b4a]"></div>
      </div>
    )
  }

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="border-white/10 hover:bg-white/5"
          onClick={() => router.push(`/orcamentos/${id}`)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold text-white font-sfpro">Editar Orçamento</h1>
      </div>

      <motion.div
        className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-xl"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Cliente</Label>
              <Input
                id="nome"
                placeholder="Digite o nome completo"
                {...register("nome", { required: "Nome é obrigatório" })}
                className="bg-white/5 border-white/10 focus:border-[#00D4FF]/50 text-white placeholder:text-gray-500"
              />
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
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, "")
                  if (value.length <= 11) {
                    value = value.replace(/^(\d{2})(\d)/g, "($1) $2")
                    value = value.replace(/(\d)(\d{4})$/, "$1-$2")
                    e.target.value = value
                  }
                }}
              />
              {errors.telefone && <p className="text-red-500 text-sm">{errors.telefone.message}</p>}
            </div>
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
                    className="border-[#00D4FF]/20 text-[#00D4FF] hover:bg-[#00D4FF]/10"
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
                    className="border-[#00D4FF]/20 text-[#00D4FF] hover:bg-[#00D4FF]/10"
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
              {custosAdicionais.length === 0 ? (
                <div className="bg-white/5 p-3 rounded-md text-gray-400 text-center">
                  Nenhum custo adicional adicionado
                </div>
              ) : (
                custosAdicionais.map((custo, index) => (
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
              className="bg-white/5 border-white/10 text-[#00D4FF] font-bold"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              {...register("observacoes")}
              className="bg-white/5 border-white/10 focus:border-[#00D4FF]/50 min-h-[100px] text-white"
            />
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            <Button
              type="button"
              onClick={() => router.push(`/orcamentos/${id}`)}
              variant="outline"
              className="flex-1 min-w-[120px] border-white/20 hover:bg-white/5"
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 min-w-[120px] bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/20 backdrop-blur-sm hover:bg-[#00D4FF]/20 transition-all"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin mr-2 h-4 w-4 border-2 border-t-transparent border-[#00D4FF] rounded-full" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Salvar Alterações
                </>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}
