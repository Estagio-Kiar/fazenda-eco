import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import { api } from '.'
import type { FiltrosCatalogo } from './tipos'

/**
 * Chaves e funções de cada pedido, num só sítio.
 * Usar com useQuery(consultas.produto(slug)) ou queryClient.prefetchQuery(...).
 */
export const consultas = {
  produtos: (filtros: FiltrosCatalogo) =>
    queryOptions({
      queryKey: ['produtos', 'lista', filtros],
      queryFn: () => api.listarProdutos(filtros),
      placeholderData: keepPreviousData,
    }),
  produto: (slug: string) =>
    queryOptions({
      queryKey: ['produtos', 'detalhe', slug],
      queryFn: () => api.obterProduto(slug),
    }),
  porIds: (ids: string[]) =>
    queryOptions({
      queryKey: ['produtos', 'ids', [...ids].sort()],
      queryFn: () => api.obterProdutosPorIds(ids),
      enabled: ids.length > 0,
    }),
  destaques: () =>
    queryOptions({ queryKey: ['produtos', 'destaques'], queryFn: () => api.listarDestaques() }),
  relacionados: (slug: string) =>
    queryOptions({
      queryKey: ['produtos', 'relacionados', slug],
      queryFn: () => api.listarRelacionados(slug),
    }),
  categorias: () =>
    queryOptions({
      queryKey: ['categorias'],
      queryFn: () => api.listarCategorias(),
      staleTime: 60 * 60_000,
    }),
  cabazes: () => queryOptions({ queryKey: ['cabazes'], queryFn: () => api.listarCabazes() }),
  cabaz: (slug: string) =>
    queryOptions({ queryKey: ['cabazes', slug], queryFn: () => api.obterCabaz(slug) }),
  zonasEntrega: () =>
    queryOptions({
      queryKey: ['zonas-entrega'],
      queryFn: () => api.listarZonasEntrega(),
      staleTime: 60 * 60_000,
    }),
}
