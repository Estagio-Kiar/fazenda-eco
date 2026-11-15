import type { Cabaz, Produto } from '@/api/tipos'
import type { LinhaCarrinho } from './calculos'

export const linhaDeProduto = (p: Produto): Omit<LinhaCarrinho, 'quantidade'> => ({
  id: p.id,
  tipo: 'produto',
  slug: p.slug,
  nome: p.nome,
  preco: p.preco,
  unidade: p.unidade,
  imagem: p.imagens[0],
  passo: p.passo,
  minimo: p.minimo,
  stock: p.stock,
})

export const linhaDeCabaz = (c: Cabaz): Omit<LinhaCarrinho, 'quantidade'> => ({
  id: c.id,
  tipo: 'cabaz',
  slug: c.slug,
  nome: c.nome,
  preco: c.preco,
  unidade: 'cabaz',
  imagem: c.imagem,
  passo: 1,
  minimo: 1,
  stock: c.stock,
})

export const ligacaoLinha = (l: Pick<LinhaCarrinho, 'tipo' | 'slug'>) =>
  l.tipo === 'cabaz' ? `/cabazes#${l.slug}` : `/produto/${l.slug}`
