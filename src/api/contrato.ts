import type {
  Cabaz,
  Categoria,
  Cupao,
  FiltrosCatalogo,
  Paginado,
  Produto,
  ZonaEntrega,
} from './tipos'

/**
 * Contrato entre o front-end e a API. A implementação mock e a implementação HTTP
 * seguem este mesmo contrato, por isso as páginas não sabem de onde vêm os dados.
 */
export interface ApiLoja {
  listarProdutos(filtros: FiltrosCatalogo): Promise<Paginado<Produto>>
  obterProduto(slug: string): Promise<Produto | null>
  obterProdutosPorIds(ids: string[]): Promise<Produto[]>
  listarDestaques(): Promise<Produto[]>
  listarRelacionados(slug: string, limite?: number): Promise<Produto[]>
  listarCategorias(): Promise<Categoria[]>
  listarCabazes(): Promise<Cabaz[]>
  obterCabaz(slug: string): Promise<Cabaz | null>
  listarZonasEntrega(): Promise<ZonaEntrega[]>
  /** Valida o cupão para o subtotal indicado. Lança ErroApi se for inválido. */
  validarCupao(codigo: string, subtotal: number): Promise<Cupao>
}

export class ErroApi extends Error {
  readonly estado: number
  constructor(mensagem: string, estado = 400) {
    super(mensagem)
    this.name = 'ErroApi'
    this.estado = estado
  }
}
