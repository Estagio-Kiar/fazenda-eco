import { useCallback } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { UNIDADES } from '@/api/tipos'
import { formatarNumero } from '@/lib/format'
import type { LinhaCarrinho } from './calculos'
import { useCarrinho } from './use-carrinho'

/** Adiciona ao carrinho e mostra a notificação «Produto adicionado ao carrinho». */
export function useAdicionarAoCarrinho() {
  const adicionar = useCarrinho((s) => s.adicionar)
  const navegar = useNavigate()

  return useCallback(
    (linha: Omit<LinhaCarrinho, 'quantidade'>, quantidade?: number) => {
      const adicionada = adicionar(linha, quantidade)
      if (adicionada <= 0) {
        toast.warning('Já tem no carrinho todo o stock disponível', { description: linha.nome })
        return false
      }
      const u = UNIDADES[linha.unidade].curta
      toast.success('Produto adicionado ao carrinho', {
        description: `${formatarNumero(adicionada)} ${u} · ${linha.nome}`,
        action: { label: 'Ver carrinho', onClick: () => navegar('/carrinho') },
      })
      return true
    },
    [adicionar, navegar],
  )
}
