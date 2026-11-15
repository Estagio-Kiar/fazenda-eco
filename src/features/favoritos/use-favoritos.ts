import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type EstadoFavoritos = {
  ids: string[]
  alternar: (id: string) => boolean
  remover: (id: string) => void
}

/** Favoritos guardados no navegador. Quando houver conta de cliente, sincronizar com a API. */
export const useFavoritos = create<EstadoFavoritos>()(
  persist(
    (set, get) => ({
      ids: [],
      alternar(id) {
        const ja = get().ids.includes(id)
        set((s) => ({ ids: ja ? s.ids.filter((x) => x !== id) : [...s.ids, id] }))
        return !ja
      },
      remover(id) {
        set((s) => ({ ids: s.ids.filter((x) => x !== id) }))
      },
    }),
    { name: 'fazenda-favoritos', version: 1 },
  ),
)

export const useEFavorito = (id: string) => useFavoritos((s) => s.ids.includes(id))
