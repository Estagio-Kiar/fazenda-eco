import type { Cupao, Unidade, ZonaEntrega } from '@/api/tipos'
import { arredondar } from '@/lib/format'

/** Valor a partir do qual a entrega em Luanda é grátis. */
export const ENTREGA_GRATIS_A_PARTIR = 25_000

export type LinhaCarrinho = {
  /** id do produto ou do cabaz */
  id: string
  tipo: 'produto' | 'cabaz'
  slug: string
  nome: string
  preco: number
  unidade: Unidade
  imagem: string
  passo: number
  minimo: number
  stock: number
  quantidade: number
}

export const totalLinha = (l: LinhaCarrinho) => Math.round(l.preco * l.quantidade)

export const calcularSubtotal = (linhas: LinhaCarrinho[]) =>
  linhas.reduce((s, l) => s + totalLinha(l), 0)

/** Número de artigos diferentes (uma linha de 1,5 kg conta como 1). */
export const contarArtigos = (linhas: LinhaCarrinho[]) => linhas.length

export function calcularDesconto(cupao: Cupao | null, subtotal: number) {
  if (!cupao || subtotal <= 0) return 0
  if (cupao.minimo && subtotal < cupao.minimo) return 0
  if (cupao.tipo === 'percentagem') return Math.round((subtotal * cupao.valor) / 100)
  if (cupao.tipo === 'valor') return Math.min(cupao.valor, subtotal)
  return 0
}

export function calcularEntrega(zona: ZonaEntrega | null, subtotal: number, cupao: Cupao | null) {
  if (!zona) return null
  if (cupao?.tipo === 'entrega-gratis') return 0
  if (subtotal >= ENTREGA_GRATIS_A_PARTIR) return 0
  return zona.custo
}

export function calcularResumo(
  linhas: LinhaCarrinho[],
  cupao: Cupao | null,
  zona: ZonaEntrega | null,
) {
  const subtotal = calcularSubtotal(linhas)
  const desconto = calcularDesconto(cupao, subtotal)
  const entrega = calcularEntrega(zona, subtotal, cupao)
  const total = subtotal - desconto + (entrega ?? 0)
  const faltaParaEntregaGratis = Math.max(0, ENTREGA_GRATIS_A_PARTIR - subtotal)
  return { subtotal, desconto, entrega, total, faltaParaEntregaGratis }
}

/** Ajusta a quantidade ao passo, ao mínimo e ao stock. */
export function ajustarQuantidade(q: number, l: Pick<LinhaCarrinho, 'passo' | 'minimo' | 'stock'>) {
  const passos = Math.round(q / l.passo)
  const valor = arredondar(passos * l.passo)
  return Math.min(Math.max(valor, l.minimo), l.stock)
}
