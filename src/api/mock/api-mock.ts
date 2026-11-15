import { ErroApi, type ApiLoja } from '../contrato'
import type { FiltrosCatalogo, Produto } from '../tipos'
import { cabazes, categorias, cupoes, produtos, zonasEntrega } from './dados'

/** Simula a latência da rede para vermos os estados de carregamento. */
const esperar = <T>(valor: T, ms = 250 + Math.random() * 300) =>
  new Promise<T>((resolve) => setTimeout(() => resolve(structuredClone(valor)), ms))

const normalizar = (s: string) =>
  s
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()

export function filtrarProdutos(lista: Produto[], f: FiltrosCatalogo) {
  let r = lista
  if (f.q?.trim()) {
    const termos = normalizar(f.q).split(/\s+/).filter(Boolean)
    r = r.filter((p) => {
      const alvo = normalizar(`${p.nome} ${p.descricaoCurta} ${p.categoria}`)
      return termos.every((t) => alvo.includes(t))
    })
  }
  if (f.categorias?.length) r = r.filter((p) => f.categorias!.includes(p.categoria))
  if (f.epoca) r = r.filter((p) => p.epoca === f.epoca || p.epoca === 'todo-ano')
  if (f.precoMin != null) r = r.filter((p) => p.preco >= f.precoMin!)
  if (f.precoMax != null) r = r.filter((p) => p.preco <= f.precoMax!)
  if (f.apenasPromocoes) r = r.filter((p) => p.precoAnterior != null)

  const ordenado = [...r]
  switch (f.ordenar) {
    case 'preco-asc':
      ordenado.sort((a, b) => a.preco - b.preco)
      break
    case 'preco-desc':
      ordenado.sort((a, b) => b.preco - a.preco)
      break
    case 'novidades':
      ordenado.sort((a, b) => b.criadoEm.localeCompare(a.criadoEm))
      break
    case 'nome':
      ordenado.sort((a, b) => a.nome.localeCompare(b.nome, 'pt'))
      break
    default:
      // relevância: em stock primeiro, depois destaques
      ordenado.sort(
        (a, b) =>
          Number(b.stock > 0) - Number(a.stock > 0) || Number(!!b.destaque) - Number(!!a.destaque),
      )
  }
  return ordenado
}

export const apiMock: ApiLoja = {
  async listarProdutos(f) {
    const porPagina = f.porPagina ?? 12
    const filtrados = filtrarProdutos(produtos, f)
    const totalPaginas = Math.max(1, Math.ceil(filtrados.length / porPagina))
    const pagina = Math.min(Math.max(1, f.pagina ?? 1), totalPaginas)
    const itens = filtrados.slice((pagina - 1) * porPagina, pagina * porPagina)
    return esperar({ itens, total: filtrados.length, pagina, porPagina, totalPaginas })
  },
  async obterProduto(slug) {
    return esperar(produtos.find((p) => p.slug === slug) ?? null)
  },
  async obterProdutosPorIds(ids) {
    return esperar(produtos.filter((p) => ids.includes(p.id)))
  },
  async listarDestaques() {
    return esperar(produtos.filter((p) => p.destaque))
  },
  async listarRelacionados(slug, limite = 8) {
    const p = produtos.find((x) => x.slug === slug)
    if (!p) return esperar([])
    const mesma = produtos.filter((x) => x.categoria === p.categoria && x.id !== p.id)
    const outras = produtos.filter((x) => x.categoria !== p.categoria && x.destaque)
    return esperar([...mesma, ...outras].slice(0, limite))
  },
  async listarCategorias() {
    return esperar(categorias, 100)
  },
  async listarCabazes() {
    return esperar(cabazes)
  },
  async obterCabaz(slug) {
    return esperar(cabazes.find((c) => c.slug === slug) ?? null)
  },
  async listarZonasEntrega() {
    return esperar(zonasEntrega, 100)
  },
  async validarCupao(codigo, subtotal) {
    await esperar(null, 400)
    const c = cupoes.find((x) => x.codigo === codigo.trim().toUpperCase())
    if (!c) throw new ErroApi('Este cupão não existe ou já expirou.', 404)
    if (c.minimo && subtotal < c.minimo)
      throw new ErroApi(
        `Este cupão só é válido em compras a partir de ${c.minimo.toLocaleString('pt-AO')} Kz.`,
      )
    return structuredClone(c)
  },
}
