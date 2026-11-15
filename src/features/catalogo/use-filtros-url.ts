import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router'
import type { CategoriaId, Epoca, FiltrosCatalogo, Ordenacao } from '@/api/tipos'

export const PRECO_MIN = 0
export const PRECO_MAX = 5000
export const POR_PAGINA = 12

const ORDENACOES: Ordenacao[] = ['relevancia', 'preco-asc', 'preco-desc', 'novidades', 'nome']
const EPOCAS: Epoca[] = ['todo-ano', 'chuvas', 'cacimbo']

const numero = (v: string | null) => {
  if (v == null || v === '') return undefined
  const n = Number(v)
  return Number.isFinite(n) ? n : undefined
}

/**
 * Os filtros do catálogo vivem no endereço (?categoria=frutas&min=500…),
 * para que o cliente possa partilhar a pesquisa e usar o botão «voltar».
 */
export function useFiltrosUrl() {
  const [params, setParams] = useSearchParams()

  const filtros = useMemo<FiltrosCatalogo>(() => {
    const ordenar = params.get('ordenar') as Ordenacao | null
    const epoca = params.get('epoca') as Epoca | null
    return {
      q: params.get('q') ?? undefined,
      categorias: params.getAll('categoria') as CategoriaId[],
      epoca: epoca && EPOCAS.includes(epoca) ? epoca : undefined,
      precoMin: numero(params.get('min')),
      precoMax: numero(params.get('max')),
      ordenar: ordenar && ORDENACOES.includes(ordenar) ? ordenar : 'relevancia',
      apenasPromocoes: params.get('promocao') === '1',
      pagina: numero(params.get('pagina')) ?? 1,
      porPagina: POR_PAGINA,
    }
  }, [params])

  /** Altera parâmetros; qualquer mudança de filtro volta à página 1. */
  const actualizar = useCallback(
    (mudar: (p: URLSearchParams) => void, { manterPagina = false } = {}) => {
      setParams(
        (anterior) => {
          const p = new URLSearchParams(anterior)
          mudar(p)
          if (!manterPagina) p.delete('pagina')
          return p
        },
        { preventScrollReset: true },
      )
    },
    [setParams],
  )

  const accoes = useMemo(
    () => ({
      alternarCategoria(id: CategoriaId) {
        actualizar((p) => {
          const actuais = p.getAll('categoria')
          p.delete('categoria')
          const novas = actuais.includes(id) ? actuais.filter((c) => c !== id) : [...actuais, id]
          novas.forEach((c) => p.append('categoria', c))
        })
      },
      definirEpoca(e?: Epoca) {
        actualizar((p) => (e ? p.set('epoca', e) : p.delete('epoca')))
      },
      definirPreco(min?: number, max?: number) {
        actualizar((p) => {
          if (min != null && min > PRECO_MIN) p.set('min', String(min))
          else p.delete('min')
          if (max != null && max < PRECO_MAX) p.set('max', String(max))
          else p.delete('max')
        })
      },
      definirOrdenacao(o: Ordenacao) {
        actualizar((p) => (o === 'relevancia' ? p.delete('ordenar') : p.set('ordenar', o)))
      },
      definirPesquisa(q: string) {
        actualizar((p) => (q.trim() ? p.set('q', q.trim()) : p.delete('q')))
      },
      alternarPromocoes() {
        actualizar((p) =>
          p.get('promocao') === '1' ? p.delete('promocao') : p.set('promocao', '1'),
        )
      },
      irParaPagina(n: number) {
        actualizar((p) => (n <= 1 ? p.delete('pagina') : p.set('pagina', String(n))), {
          manterPagina: true,
        })
      },
      limpar() {
        actualizar((p) => {
          for (const k of ['categoria', 'epoca', 'min', 'max', 'promocao', 'q']) p.delete(k)
        })
      },
    }),
    [actualizar],
  )

  const numeroFiltrosActivos =
    (filtros.categorias?.length ?? 0) +
    (filtros.epoca ? 1 : 0) +
    (filtros.precoMin != null || filtros.precoMax != null ? 1 : 0) +
    (filtros.apenasPromocoes ? 1 : 0)

  return { filtros, ...accoes, numeroFiltrosActivos }
}

export type FiltrosUrl = ReturnType<typeof useFiltrosUrl>
