import type { Cupao, ZonaEntrega } from '@/api/tipos'
import {
  ajustarQuantidade,
  calcularDesconto,
  calcularEntrega,
  calcularResumo,
  ENTREGA_GRATIS_A_PARTIR,
  type LinhaCarrinho,
} from './calculos'

const linha = (o: Partial<LinhaCarrinho> = {}): LinhaCarrinho => ({
  id: 'p1',
  tipo: 'produto',
  slug: 'tomate',
  nome: 'Tomate',
  preco: 1500,
  unidade: 'kg',
  imagem: '',
  passo: 0.5,
  minimo: 0.5,
  stock: 10,
  quantidade: 1,
  ...o,
})
const zona: ZonaEntrega = { id: 'z', nome: 'Talatona', custo: 1500, prazo: '' }
const pct: Cupao = { codigo: 'X', descricao: '', tipo: 'percentagem', valor: 10 }

describe('cálculos do carrinho', () => {
  it('soma o subtotal com quantidades fraccionadas', () => {
    const r = calcularResumo(
      [linha({ quantidade: 1.5 }), linha({ id: 'p2', preco: 450, quantidade: 3 })],
      null,
      null,
    )
    expect(r.subtotal).toBe(2250 + 1350)
    expect(r.entrega).toBeNull()
  })

  it('aplica cupão de percentagem e de valor com mínimo', () => {
    expect(calcularDesconto(pct, 5000)).toBe(500)
    const valor: Cupao = { codigo: 'Y', descricao: '', tipo: 'valor', valor: 1000, minimo: 8000 }
    expect(calcularDesconto(valor, 7999)).toBe(0)
    expect(calcularDesconto(valor, 8000)).toBe(1000)
  })

  it('entrega grátis a partir do limite ou com cupão', () => {
    expect(calcularEntrega(zona, 1000, null)).toBe(1500)
    expect(calcularEntrega(zona, ENTREGA_GRATIS_A_PARTIR, null)).toBe(0)
    expect(
      calcularEntrega(zona, 1000, { codigo: 'E', descricao: '', tipo: 'entrega-gratis', valor: 0 }),
    ).toBe(0)
  })

  it('total = subtotal − desconto + entrega', () => {
    const r = calcularResumo([linha({ quantidade: 2 })], pct, zona)
    expect(r.total).toBe(3000 - 300 + 1500)
  })

  it('ajusta a quantidade ao passo, mínimo e stock', () => {
    const l = { passo: 0.5, minimo: 0.5, stock: 3 }
    expect(ajustarQuantidade(1.3, l)).toBe(1.5)
    expect(ajustarQuantidade(0, l)).toBe(0.5)
    expect(ajustarQuantidade(10, l)).toBe(3)
  })
})
