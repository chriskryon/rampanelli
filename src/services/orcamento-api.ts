import { mockOrcamentos } from "@/mocks/mock-data"
import { Orcamento } from "@/types/types"

function loadOrcamentos(): Orcamento[] {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("orcamentos")
    if (saved) return JSON.parse(saved)
  }
  return [...mockOrcamentos]
}

function saveOrcamentos(data: Orcamento[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem("orcamentos", JSON.stringify(data))
  }
}

export async function getOrcamentos(): Promise<Orcamento[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(loadOrcamentos()), 500)
  })
}

export async function getOrcamentoById(id: string): Promise<Orcamento | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const orcamentos = loadOrcamentos()
      resolve(orcamentos.find(o => o.id === id))
    }, 500)
  })
}

export async function createOrcamento(data: Orcamento): Promise<Orcamento> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const orcamentos = loadOrcamentos()
      orcamentos.push(data)
      saveOrcamentos(orcamentos)
      resolve(data)
    }, 500)
  })
}

export async function updateOrcamento(id: string, update: Partial<Orcamento>): Promise<Orcamento | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const orcamentos = loadOrcamentos()
      const idx = orcamentos.findIndex(o => o.id === id)
      if (idx !== -1) {
        orcamentos[idx] = { ...orcamentos[idx], ...update }
        saveOrcamentos(orcamentos)
        resolve(orcamentos[idx])
      } else {
        resolve(undefined)
      }
    }, 500)
  })
}

export async function deleteOrcamento(id: string): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      let orcamentos = loadOrcamentos()
      const prevLen = orcamentos.length
      orcamentos = orcamentos.filter(o => o.id !== id)
      saveOrcamentos(orcamentos)
      resolve(orcamentos.length < prevLen)
    }, 500)
  })
}
