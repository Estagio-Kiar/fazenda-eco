/**
 * Tipos partilhados com a API.
 *
 * Enquanto a API do Artur não está pronta, estes tipos são a proposta do front-end.
 * Quando houver Swagger, gerar os tipos com `npm run api:tipos` e alinhar os nomes aqui.
 * Campos do 3D acordados no relatório: `model_url` e `poster_url` (aqui modeloUrl / posterUrl).
 */

export type CategoriaId = 'frutas' | 'legumes' | 'hortalicas' | 'tuberculos' | 'graos' | 'ovos-mel'

export type Categoria = {
  id: CategoriaId
  nome: string
  descricao: string
}

/** Épocas do ano em Angola: chuvas (Out–Mai) e cacimbo (Jun–Set). */
export type Epoca = 'todo-ano' | 'chuvas' | 'cacimbo'

export type Unidade = 'kg' | 'unidade' | 'molho' | 'duzia' | 'frasco' | 'cabaz' | 'saco'

export type Modelo3D = {
  /** Endereço do ficheiro .glb (Cloudinary em produção). */
  modeloUrl: string
  /** Imagem mostrada antes de o modelo carregar. */
  posterUrl: string
  /** Tamanho em bytes, para avisar o cliente em redes móveis. */
  tamanho?: number
}

export type Produto = {
  id: string
  slug: string
  nome: string
  descricaoCurta: string
  descricao: string
  categoria: CategoriaId
  epoca: Epoca
  /** Preço em kwanzas por unidade de venda. */
  preco: number
  /** Preço antes da promoção, se houver. */
  precoAnterior?: number
  unidade: Unidade
  /** Incremento permitido na quantidade (ex.: 0,5 para kg). */
  passo: number
  /** Quantidade mínima por encomenda. */
  minimo: number
  stock: number
  imagens: string[]
  modelo3d?: Modelo3D
  destaque?: boolean
  origem: string
  criadoEm: string
}

export type Cabaz = {
  id: string
  slug: string
  nome: string
  descricao: string
  preco: number
  precoAnterior?: number
  imagem: string
  itens: { produtoId: string; nome: string; quantidade: number; unidade: Unidade }[]
  serve: string
  stock: number
}

export type Ordenacao = 'relevancia' | 'preco-asc' | 'preco-desc' | 'novidades' | 'nome'

export type FiltrosCatalogo = {
  q?: string
  categorias?: CategoriaId[]
  epoca?: Epoca
  precoMin?: number
  precoMax?: number
  ordenar?: Ordenacao
  apenasPromocoes?: boolean
  pagina?: number
  porPagina?: number
}

export type Paginado<T> = {
  itens: T[]
  total: number
  pagina: number
  porPagina: number
  totalPaginas: number
}

export type ZonaEntrega = {
  id: string
  nome: string
  custo: number
  prazo: string
}

export type Cupao = {
  codigo: string
  descricao: string
  tipo: 'percentagem' | 'valor' | 'entrega-gratis'
  valor: number
  minimo?: number
}

export const UNIDADES: Record<Unidade, { curta: string; longa: string }> = {
  kg: { curta: 'kg', longa: 'por kg' },
  unidade: { curta: 'un.', longa: 'por unidade' },
  molho: { curta: 'molho', longa: 'por molho' },
  duzia: { curta: 'dz.', longa: 'por dúzia' },
  frasco: { curta: 'frasco', longa: 'por frasco' },
  cabaz: { curta: 'cabaz', longa: 'por cabaz' },
  saco: { curta: 'saco', longa: 'por saco' },
}

export const EPOCAS: Record<Epoca, string> = {
  'todo-ano': 'Todo o ano',
  chuvas: 'Época das chuvas',
  cacimbo: 'Cacimbo',
}
