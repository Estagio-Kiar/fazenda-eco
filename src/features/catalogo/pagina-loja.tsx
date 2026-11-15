import { useQuery } from '@tanstack/react-query'
import { SearchX, SlidersHorizontal, X } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { consultas } from '@/api/consultas'
import { EPOCAS, type Ordenacao } from '@/api/tipos'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { Input } from '@/components/ui/input'
import { NativeSelect } from '@/components/ui/native-select'
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  CartaoProduto,
  CartaoProdutoEsqueleto,
} from '@/features/produto/componentes/cartao-produto'
import { formatarKz } from '@/lib/format'
import { cn } from '@/lib/utils'
import { PainelFiltros } from './painel-filtros'
import { Paginacao } from './paginacao'
import { POR_PAGINA, useFiltrosUrl } from './use-filtros-url'

const ORDENAR: { valor: Ordenacao; rotulo: string }[] = [
  { valor: 'relevancia', rotulo: 'Relevância' },
  { valor: 'preco-asc', rotulo: 'Preço: mais baixo' },
  { valor: 'preco-desc', rotulo: 'Preço: mais alto' },
  { valor: 'novidades', rotulo: 'Novidades' },
  { valor: 'nome', rotulo: 'Nome (A–Z)' },
]

export default function PaginaLoja() {
  const f = useFiltrosUrl()
  const { filtros } = f
  const { data, isPending, isPlaceholderData, isError, refetch } = useQuery(
    consultas.produtos(filtros),
  )
  const { data: categorias } = useQuery(consultas.categorias())

  // O campo acompanha o endereço (ex.: pesquisa feita no cabeçalho ou «Limpar tudo»)
  const [termo, setTermo] = useState(filtros.q ?? '')
  const [qAnterior, setQAnterior] = useState(filtros.q)
  if (qAnterior !== filtros.q) {
    setQAnterior(filtros.q)
    setTermo(filtros.q ?? '')
  }

  const pesquisar = (e: FormEvent) => {
    e.preventDefault()
    f.definirPesquisa(termo)
  }

  const mudarPagina = (n: number) => {
    f.irParaPagina(n)
    document.getElementById('resultados')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const nomeCategoria = (id: string) => categorias?.find((c) => c.id === id)?.nome ?? id

  const chips = [
    ...(filtros.q
      ? [{ chave: 'q', rotulo: `«${filtros.q}»`, remover: () => f.definirPesquisa('') }]
      : []),
    ...(filtros.categorias ?? []).map((c) => ({
      chave: `c-${c}`,
      rotulo: nomeCategoria(c),
      remover: () => f.alternarCategoria(c),
    })),
    ...(filtros.epoca
      ? [{ chave: 'e', rotulo: EPOCAS[filtros.epoca], remover: () => f.definirEpoca(undefined) }]
      : []),
    ...(filtros.precoMin != null || filtros.precoMax != null
      ? [
          {
            chave: 'p',
            rotulo: `${formatarKz(filtros.precoMin ?? 0)} – ${filtros.precoMax != null ? formatarKz(filtros.precoMax) : '…'}`,
            remover: () => f.definirPreco(undefined, undefined),
          },
        ]
      : []),
    ...(filtros.apenasPromocoes
      ? [{ chave: 'promo', rotulo: 'Promoções', remover: f.alternarPromocoes }]
      : []),
  ]

  return (
    <div className="container-loja py-8 sm:py-10">
      <header className="mb-6 flex flex-col gap-4 sm:mb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold sm:text-4xl">Loja</h1>
          <p className="mt-1 text-muted-foreground">Frutas, legumes e mais, colhidos na Fazenda.</p>
        </div>
        <form role="search" onSubmit={pesquisar} className="flex w-full gap-2 lg:max-w-md">
          <label htmlFor="pesquisa-catalogo" className="sr-only">
            Procurar no catálogo
          </label>
          <Input
            id="pesquisa-catalogo"
            type="search"
            placeholder="Ex.: tomate, manga, ovos…"
            value={termo}
            onChange={(e) => setTermo(e.target.value)}
          />
          <Button type="submit">Procurar</Button>
        </form>
      </header>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block" aria-label="Filtros">
          <div className="sticky top-32">
            <PainelFiltros f={f} />
          </div>
        </aside>

        <section
          id="resultados"
          className="scroll-mt-32"
          aria-live="polite"
          aria-busy={isPending || isPlaceholderData}
        >
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sheet>
                <SheetTrigger
                  render={
                    <Button variant="outline" className="lg:hidden">
                      <SlidersHorizontal />
                      Filtros
                      {f.numeroFiltrosActivos > 0 && (
                        <span className="rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
                          {f.numeroFiltrosActivos}
                        </span>
                      )}
                    </Button>
                  }
                />
                <SheetContent
                  side="bottom"
                  title="Filtros"
                  footer={
                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1" onClick={f.limpar}>
                        Limpar
                      </Button>
                      <SheetClose render={<Button className="flex-1" />}>
                        Ver {data?.total ?? ''} produtos
                      </SheetClose>
                    </div>
                  }
                >
                  <PainelFiltros f={f} />
                </SheetContent>
              </Sheet>
              <p className="hidden text-sm text-muted-foreground sm:block">
                {data
                  ? `${data.total} ${data.total === 1 ? 'produto' : 'produtos'}`
                  : 'A carregar…'}
              </p>
            </div>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="hidden sm:inline">Ordenar por</span>
              <NativeSelect
                value={filtros.ordenar}
                onChange={(e) => f.definirOrdenacao(e.target.value as Ordenacao)}
                aria-label="Ordenar produtos"
                className="w-40 sm:w-44"
              >
                {ORDENAR.map((o) => (
                  <option key={o.valor} value={o.valor}>
                    {o.rotulo}
                  </option>
                ))}
              </NativeSelect>
            </label>
          </div>

          {chips.length > 0 && (
            <div className="mb-5 flex flex-wrap items-center gap-2">
              {chips.map((c) => (
                <button
                  key={c.chave}
                  type="button"
                  onClick={c.remover}
                  className="inline-flex items-center gap-1 rounded-full bg-menta px-3 py-1 text-xs font-medium text-floresta transition-colors hover:bg-salvia/60"
                  aria-label={`Remover filtro ${c.rotulo}`}
                >
                  {c.rotulo} <X className="size-3" />
                </button>
              ))}
              <Button variant="link" size="sm" onClick={f.limpar}>
                Limpar tudo
              </Button>
            </div>
          )}

          {isError ? (
            <EmptyState
              icon={SearchX}
              title="Não foi possível carregar os produtos"
              description="Verifique a ligação à internet e tente de novo."
              action={<Button onClick={() => refetch()}>Tentar de novo</Button>}
            />
          ) : isPending ? (
            <Grelha>
              {Array.from({ length: POR_PAGINA }, (_, i) => (
                <CartaoProdutoEsqueleto key={i} />
              ))}
            </Grelha>
          ) : data.itens.length === 0 ? (
            <EmptyState
              icon={SearchX}
              title="Nenhum produto encontrado"
              description="Experimente outra pesquisa ou retire alguns filtros."
              action={
                <Button variant="outline" onClick={f.limpar}>
                  Limpar filtros
                </Button>
              }
            />
          ) : (
            <>
              <Grelha className={cn('transition-opacity', isPlaceholderData && 'opacity-60')}>
                {data.itens.map((p) => (
                  <CartaoProduto key={p.id} produto={p} />
                ))}
              </Grelha>
              <Paginacao
                pagina={data.pagina}
                totalPaginas={data.totalPaginas}
                onMudar={mudarPagina}
              />
            </>
          )}
        </section>
      </div>
    </div>
  )
}

function Grelha({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn('grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3', className)}>
      {children}
    </div>
  )
}
