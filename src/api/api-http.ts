import { ErroApi, type ApiLoja } from './contrato'
import type { Cabaz, Categoria, Cupao, Paginado, Produto, ZonaEntrega } from './tipos'

/**
 * Implementação HTTP do contrato. Os caminhos são uma PROPOSTA a acertar com o back-end
 * (Node.js + Express + Swagger). Quando o Swagger existir, confirmar aqui os endpoints.
 */
export function criarApiHttp(baseUrl: string): ApiLoja {
  async function pedir<T>(caminho: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${baseUrl.replace(/\/$/, '')}${caminho}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      credentials: 'include',
      ...init,
    })
    if (!res.ok) {
      let mensagem = 'Ocorreu um erro. Tente novamente.'
      try {
        const corpo = await res.json()
        mensagem = corpo?.mensagem ?? corpo?.message ?? mensagem
      } catch {
        /* resposta sem JSON */
      }
      throw new ErroApi(mensagem, res.status)
    }
    return res.json() as Promise<T>
  }

  const ouNull = async <T>(p: Promise<T>) => {
    try {
      return await p
    } catch (e) {
      if (e instanceof ErroApi && e.estado === 404) return null
      throw e
    }
  }

  return {
    listarProdutos(f) {
      const qs = new URLSearchParams()
      if (f.q) qs.set('q', f.q)
      f.categorias?.forEach((c) => qs.append('categoria', c))
      if (f.epoca) qs.set('epoca', f.epoca)
      if (f.precoMin != null) qs.set('preco_min', String(f.precoMin))
      if (f.precoMax != null) qs.set('preco_max', String(f.precoMax))
      if (f.apenasPromocoes) qs.set('promocao', 'true')
      if (f.ordenar) qs.set('ordenar', f.ordenar)
      qs.set('pagina', String(f.pagina ?? 1))
      qs.set('por_pagina', String(f.porPagina ?? 12))
      return pedir<Paginado<Produto>>(`/produtos?${qs}`)
    },
    obterProduto: (slug) => ouNull(pedir<Produto>(`/produtos/${encodeURIComponent(slug)}`)),
    obterProdutosPorIds: (ids) =>
      ids.length
        ? pedir<Produto[]>(`/produtos?${new URLSearchParams(ids.map((id) => ['id', id]))}`)
        : Promise.resolve([]),
    listarDestaques: () => pedir<Produto[]>('/produtos/destaques'),
    listarRelacionados: (slug, limite = 8) =>
      pedir<Produto[]>(`/produtos/${encodeURIComponent(slug)}/relacionados?limite=${limite}`),
    listarCategorias: () => pedir<Categoria[]>('/categorias'),
    listarCabazes: () => pedir<Cabaz[]>('/cabazes'),
    obterCabaz: (slug) => ouNull(pedir<Cabaz>(`/cabazes/${encodeURIComponent(slug)}`)),
    listarZonasEntrega: () => pedir<ZonaEntrega[]>('/zonas-entrega'),
    validarCupao: (codigo, subtotal) =>
      pedir<Cupao>('/cupoes/validar', {
        method: 'POST',
        body: JSON.stringify({ codigo, subtotal }),
      }),
  }
}
