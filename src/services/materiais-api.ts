import { defaultItensCatalogo } from "@/mocks/mock-data"
import { Item } from "@/types/types"

const STORAGE_KEY = "materiais"

function loadMateriais(): Item[] {
  if (typeof window === "undefined") return [...defaultItensCatalogo]
  const data = localStorage.getItem(STORAGE_KEY)
  if (data) {
    try {
      return JSON.parse(data)
    } catch {
      return [...defaultItensCatalogo]
    }
  }
  return [...defaultItensCatalogo]
}

function saveMateriais(materiais: Item[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(materiais))
  }
}

export async function getMateriais(): Promise<Item[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...loadMateriais()]), 500)
  })
}

export async function getMaterialById(id: number): Promise<Item | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(loadMateriais().find(i => i.id === id)), 500)
  })
}

export async function createMaterial(data: Item): Promise<Item> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const materiais = loadMateriais()
      materiais.push(data)
      saveMateriais(materiais)
      resolve(data)
    }, 500)
  })
}

export async function updateMaterial(id: number, update: Partial<Item>): Promise<Item | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const materiais = loadMateriais()
      const idx = materiais.findIndex(i => i.id === id)
      if (idx !== -1) {
        materiais[idx] = { ...materiais[idx], ...update }
        saveMateriais(materiais)
        resolve(materiais[idx])
      } else {
        resolve(undefined)
      }
    }, 500)
  })
}

export async function deleteMaterial(id: number): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      let materiais = loadMateriais()
      const prevLen = materiais.length
      materiais = materiais.filter(i => i.id !== id)
      saveMateriais(materiais)
      resolve(materiais.length < prevLen)
    }, 500)
  })
}
