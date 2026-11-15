import { createBrowserRouter, type RouteObject } from 'react-router'
import { LayoutRaiz } from '@/components/layout/layout-raiz'
import { PaginaEmBreve } from '@/features/em-breve/pagina-em-breve'
import PaginaNaoEncontrada from '@/features/em-breve/pagina-nao-encontrada'
import PaginaInicio from '@/features/inicio/pagina-inicio'

/** Cada página (excepto o início) é um ficheiro à parte, descarregado só quando o cliente lá vai. */
const pagina =
  (importar: () => Promise<{ default: React.ComponentType }>): RouteObject['lazy'] =>
  async () => ({ Component: (await importar()).default })

/**
 * Rotas da loja (relatório, secção A.3).
 * /checkout e /conta → parte 7; /admin → parte 8.
 */
export const router = createBrowserRouter([
  {
    element: <LayoutRaiz />,
    HydrateFallback: () => null,
    children: [
      { index: true, element: <PaginaInicio /> },
      { path: 'loja', lazy: pagina(() => import('@/features/catalogo/pagina-loja')) },
      { path: 'produto/:slug', lazy: pagina(() => import('@/features/produto/pagina-produto')) },
      { path: 'cabazes', lazy: pagina(() => import('@/features/cabazes/pagina-cabazes')) },
      { path: 'carrinho', lazy: pagina(() => import('@/features/carrinho/pagina-carrinho')) },
      { path: 'favoritos', lazy: pagina(() => import('@/features/favoritos/pagina-favoritos')) },
      { path: 'checkout', element: <PaginaEmBreve titulo="Checkout" parte="parte 7" /> },
      { path: 'conta/*', element: <PaginaEmBreve titulo="A minha conta" parte="parte 7" /> },
      { path: 'admin/*', element: <PaginaEmBreve titulo="Painel de gestão" parte="parte 8" /> },
      { path: 'guia', lazy: pagina(() => import('@/features/guia/pagina-guia')) },
      { path: '*', element: <PaginaNaoEncontrada /> },
    ],
  },
])
