import { useCarrinho } from './use-carrinho'

const tomate = {
  id: 'p1',
  tipo: 'produto' as const,
  slug: 'tomate',
  nome: 'Tomate',
  preco: 1500,
  unidade: 'kg' as const,
  imagem: '',
  passo: 0.5,
  minimo: 0.5,
  stock: 2,
}

beforeEach(() => {
  localStorage.clear()
  useCarrinho.setState({ linhas: [], cupao: null, zona: null })
})

describe('useCarrinho', () => {
  it('adiciona e junta linhas do mesmo produto', () => {
    const { adicionar } = useCarrinho.getState()
    expect(adicionar(tomate, 1)).toBe(1)
    expect(adicionar(tomate, 0.5)).toBe(0.5)
    expect(useCarrinho.getState().linhas).toHaveLength(1)
    expect(useCarrinho.getState().linhas[0].quantidade).toBe(1.5)
  })

  it('não passa do stock', () => {
    const { adicionar } = useCarrinho.getState()
    adicionar(tomate, 1.5)
    expect(adicionar(tomate, 1)).toBe(0.5)
    expect(adicionar(tomate, 1)).toBe(0)
    expect(useCarrinho.getState().linhas[0].quantidade).toBe(2)
  })

  it('remove e guarda no navegador', () => {
    useCarrinho.getState().adicionar(tomate, 1)
    expect(localStorage.getItem('fazenda-carrinho')).toContain('"p1"')
    useCarrinho.getState().remover('p1')
    expect(useCarrinho.getState().linhas).toHaveLength(0)
  })
})
