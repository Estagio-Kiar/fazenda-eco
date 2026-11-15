import { filtrarProdutos } from './api-mock'
import { produtos } from './dados'

describe('filtrarProdutos (mock)', () => {
  it('pesquisa sem acentos nem maiúsculas', () => {
    const r = filtrarProdutos(produtos, { q: 'ABOBORA' })
    expect(r.map((p) => p.slug)).toEqual(['abobora'])
  })
  it('filtra por categoria e preço e ordena', () => {
    const r = filtrarProdutos(produtos, {
      categorias: ['frutas'],
      precoMax: 2000,
      ordenar: 'preco-asc',
    })
    expect(r.every((p) => p.categoria === 'frutas' && p.preco <= 2000)).toBe(true)
    expect(r.map((p) => p.preco)).toEqual([...r.map((p) => p.preco)].sort((a, b) => a - b))
  })
  it('relevância põe os esgotados no fim', () => {
    const r = filtrarProdutos(produtos, {})
    expect(r.at(-1)!.stock).toBe(0)
  })
})
