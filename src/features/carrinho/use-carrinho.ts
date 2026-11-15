import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { Cupao, ZonaEntrega } from '@/api/tipos'
import { arredondar } from '@/lib/format'
import { ajustarQuantidade, type LinhaCarrinho } from './calculos'

type NovaLinha = Omit<LinhaCarrinho, 'quantidade'>

type EstadoCarrinho = {
  linhas: LinhaCarrinho[]
  cupao: Cupao | null
  zona: ZonaEntrega | null
  /** Devolve a quantidade efectivamente adicionada (pode ser menor por causa do stock). */
  adicionar: (linha: NovaLinha, quantidade?: number) => number
  definirQuantidade: (id: string, quantidade: number) => void
  remover: (id: string) => void
  limpar: () => void
  aplicarCupao: (cupao: Cupao) => void
  removerCupao: () => void
  definirZona: (zona: ZonaEntrega | null) => void
}

/**
 * Carrinho guardado no navegador (localStorage) entre visitas.
 * Os preços guardados são uma cópia: no checkout (parte 7) a API volta a confirmar preços e stock.
 */
export const useCarrinho = create<EstadoCarrinho>()(
  persist(
    (set, get) => ({
      linhas: [],
      cupao: null,
      zona: null,

      adicionar(nova, quantidade = nova.minimo) {
        const existente = get().linhas.find((l) => l.id === nova.id)
        const anterior = existente?.quantidade ?? 0
        const desejada = ajustarQuantidade(anterior + quantidade, nova)
        const adicionada = arredondar(desejada - anterior)
        if (adicionada <= 0) return 0
        set((s) => ({
          linhas: existente
            ? s.linhas.map((l) => (l.id === nova.id ? { ...l, ...nova, quantidade: desejada } : l))
            : [...s.linhas, { ...nova, quantidade: desejada }],
        }))
        return adicionada
      },

      definirQuantidade(id, quantidade) {
        set((s) => ({
          linhas: s.linhas.map((l) =>
            l.id === id ? { ...l, quantidade: ajustarQuantidade(quantidade, l) } : l,
          ),
        }))
      },

      remover(id) {
        set((s) => ({ linhas: s.linhas.filter((l) => l.id !== id) }))
      },

      limpar() {
        set({ linhas: [], cupao: null })
      },

      aplicarCupao(cupao) {
        set({ cupao })
      },

      removerCupao() {
        set({ cupao: null })
      },

      definirZona(zona) {
        set({ zona })
      },
    }),
    {
      name: 'fazenda-carrinho',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: ({ linhas, cupao, zona }) => ({ linhas, cupao, zona }),
    },
  ),
)

/** Selector de conveniência para o número de artigos no ícone do carrinho. */
export const useNumeroArtigos = () => useCarrinho((s) => s.linhas.length)
