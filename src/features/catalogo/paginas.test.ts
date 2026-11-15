import { paginasVisiveis } from './paginas'

describe('paginasVisiveis', () => {
  it('mostra todas quando são poucas', () => {
    expect(paginasVisiveis(2, 5)).toEqual([1, 2, 3, 4, 5])
  })
  it('usa reticências quando são muitas', () => {
    expect(paginasVisiveis(6, 12)).toEqual([1, '…', 5, 6, 7, '…', 12])
    expect(paginasVisiveis(1, 12)).toEqual([1, 2, '…', 12])
  })
})
