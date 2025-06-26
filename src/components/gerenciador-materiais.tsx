"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Plus, Pencil, Trash2, Save } from "lucide-react"
import { Item } from "@/types/types"
import { useOrcamento } from "../contexts/orcamento-provider"

export function GerenciadorMateriais() {
  const { itensCatalogo, setItensCatalogo } = useOrcamento()
  const [novoItem, setNovoItem] = useState({ nome: "", valor: "" })
  const [itemEditando, setItemEditando] = useState<Item | null>(null)
  const [editandoId, setEditandoId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState({ nome: "", valor: "" })

  const handleAdicionarItem = () => {
    if (novoItem.nome.trim() === "" || novoItem.valor.trim() === "") {
      return
    }

    const valor = Number.parseFloat(novoItem.valor)
    if (isNaN(valor) || valor <= 0) {
      return
    }

    const novoId = itensCatalogo.length > 0 ? Math.max(...itensCatalogo.map((item) => item.id)) + 1 : 1

    const novoItemCompleto: Item = {
      id: novoId,
      nome: novoItem.nome,
      valor: valor,
      quantidade: 0,
    }

    setItensCatalogo([...itensCatalogo, novoItemCompleto])
    setNovoItem({ nome: "", valor: "" })
  }

  const iniciarEdicao = (item: Item) => {
    setItemEditando(item)
    setEditForm({ nome: item.nome, valor: item.valor.toString() })
  }

  const salvarEdicao = () => {
    if (!itemEditando) return

    if (editForm.nome.trim() === "" || editForm.valor.trim() === "") {
      return
    }

    const valor = Number.parseFloat(editForm.valor)
    if (isNaN(valor) || valor <= 0) {
      return
    }

    const itensAtualizados = itensCatalogo.map((item) =>
      item.id === itemEditando.id ? { ...item, nome: editForm.nome, valor: valor } : item,
    )

    setItensCatalogo(itensAtualizados)
    setItemEditando(null)
  }

  const excluirItem = (id: number) => {
    const itensAtualizados = itensCatalogo.filter((item) => item.id !== id)
    setItensCatalogo(itensAtualizados)
  }

  const iniciarEdicaoInline = (id: number) => {
    const item = itensCatalogo.find((item) => item.id === id)
    if (item) {
      setEditandoId(id)
      setEditForm({ nome: item.nome, valor: item.valor.toString() })
    }
  }

  const salvarEdicaoInline = () => {
    if (editandoId === null) return

    if (editForm.nome.trim() === "" || editForm.valor.trim() === "") {
      return
    }

    const valor = Number.parseFloat(editForm.valor)
    if (isNaN(valor) || valor <= 0) {
      return
    }

    const itensAtualizados = itensCatalogo.map((item) =>
      item.id === editandoId ? { ...item, nome: editForm.nome, valor: valor } : item,
    )

    setItensCatalogo(itensAtualizados)
    setEditandoId(null)
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white font-sfpro">Gerenciamento de Materiais</h1>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/20 backdrop-blur-sm hover:bg-[#00D4FF]/20 transition-all">
              <Plus className="mr-2 h-4 w-4" /> Novo Material
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#0A0A0B] border-white/10 text-white">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Material</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Material</Label>
                <Input
                  id="nome"
                  value={novoItem.nome}
                  onChange={(e) => setNovoItem({ ...novoItem, nome: e.target.value })}
                  placeholder="Ex: Chapa MDF"
                  className="bg-white/5 border-white/10 focus:border-[#00D4FF]/50 text-white placeholder:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="valor">Valor (R$)</Label>
                <Input
                  id="valor"
                  value={novoItem.valor}
                  onChange={(e) => setNovoItem({ ...novoItem, valor: e.target.value })}
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
                  onClick={handleAdicionarItem}
                  className="bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/20 backdrop-blur-sm hover:bg-[#00D4FF]/20 transition-all"
                >
                  Adicionar Material
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-xl">
        <h2 className="text-xl font-bold text-white mb-4 font-sfpro">Lista de Materiais</h2>

        {itensCatalogo.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">Nenhum material cadastrado</p>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="mt-4 bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/20 backdrop-blur-sm hover:bg-[#00D4FF]/20 transition-all">
                  <Plus className="mr-2 h-4 w-4" /> Adicionar Primeiro Material
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#0A0A0B] border-white/10 text-white">
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Material</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome do Material</Label>
                    <Input
                      id="nome"
                      value={novoItem.nome}
                      onChange={(e) => setNovoItem({ ...novoItem, nome: e.target.value })}
                      placeholder="Ex: Chapa MDF"
                      className="bg-white/5 border-white/10 focus:border-[#00D4FF]/50 text-white placeholder:text-gray-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="valor">Valor (R$)</Label>
                    <Input
                      id="valor"
                      value={novoItem.valor}
                      onChange={(e) => setNovoItem({ ...novoItem, valor: e.target.value })}
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
                      onClick={handleAdicionarItem}
                      className="bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/20 backdrop-blur-sm hover:bg-[#00D4FF]/20 transition-all"
                    >
                      Adicionar Material
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm font-medium text-gray-400 border-b border-white/10">
              <div className="col-span-1">#</div>
              <div className="col-span-5">Nome</div>
              <div className="col-span-3">Valor</div>
              <div className="col-span-3 text-right">Ações</div>
            </div>

            {itensCatalogo.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-12 gap-4 px-4 py-3 bg-white/5 rounded-lg items-center"
              >
                {editandoId === item.id ? (
                  <>
                    <div className="col-span-1 text-gray-400">{item.id}</div>
                    <div className="col-span-5">
                      <Input
                        value={editForm.nome}
                        onChange={(e) => setEditForm({ ...editForm, nome: e.target.value })}
                        className="bg-white/10 border-white/20 focus:border-[#00D4FF]/50 h-8 py-1 text-white"
                      />
                    </div>
                    <div className="col-span-3">
                      <div className="flex items-center">
                        <span className="bg-white/10 border border-white/20 rounded-l-md px-2 py-1 text-gray-400 text-sm">
                          R$
                        </span>
                        <Input
                          value={editForm.valor}
                          onChange={(e) => setEditForm({ ...editForm, valor: e.target.value })}
                          type="number"
                          min="0"
                          step="0.01"
                          className="bg-white/10 border-white/20 focus:border-[#00D4FF]/50 h-8 py-1 text-white"
                        />
                      </div>
                    </div>
                    <div className="col-span-3 text-right">
                      <Button
                        onClick={salvarEdicaoInline}
                        size="sm"
                        className="h-8 bg-green-500/20 text-green-500 border border-green-500/20 hover:bg-green-500/30 mr-2"
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => setEditandoId(null)}
                        size="sm"
                        variant="outline"
                        className="h-8 border-white/20 hover:bg-white/5"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="col-span-1 text-gray-400">{item.id}</div>
                    <div className="col-span-5 text-white">{item.nome}</div>
                    <div className="col-span-3 text-white">R$ {item.valor.toLocaleString("pt-BR")}</div>
                    <div className="col-span-3 text-right">
                      <Button
                        onClick={() => iniciarEdicaoInline(item.id)}
                        size="sm"
                        variant="outline"
                        className="h-8 border-white/20 hover:bg-white/5 mr-2"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => excluirItem(item.id)}
                        size="sm"
                        variant="outline"
                        className="h-8 border-red-500/20 text-red-500 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={itemEditando !== null} onOpenChange={(open) => !open && setItemEditando(null)}>
        <DialogContent className="bg-[#0A0A0B] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Editar Material</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-nome">Nome do Material</Label>
              <Input
                id="edit-nome"
                value={editForm.nome}
                onChange={(e) => setEditForm({ ...editForm, nome: e.target.value })}
                className="bg-white/5 border-white/10 focus:border-[#00D4FF]/50 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-valor">Valor (R$)</Label>
              <Input
                id="edit-valor"
                value={editForm.valor}
                onChange={(e) => setEditForm({ ...editForm, valor: e.target.value })}
                type="number"
                min="0"
                step="0.01"
                className="bg-white/5 border-white/10 focus:border-[#00D4FF]/50 text-white"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setItemEditando(null)}
              variant="outline"
              className="border-white/20 hover:bg-white/5"
            >
              Cancelar
            </Button>
            <Button
              onClick={salvarEdicao}
              className="bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/20 backdrop-blur-sm hover:bg-[#00D4FF]/20 transition-all"
            >
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
