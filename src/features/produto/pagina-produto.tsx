import { useQuery } from '@tanstack/react-query'
import { CalendarDays, ChevronRight, MapPin, PackageSearch, Truck } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { consultas } from '@/api/consultas'
import { EPOCAS, UNIDADES, type Produto } from '@/api/tipos'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { QuantityStepper } from '@/components/ui/quantity-stepper'
import { Skeleton } from '@/components/ui/skeleton'
import { ENTREGA_GRATIS_A_PARTIR } from '@/features/carrinho/calculos'
import { linhaDeProduto } from '@/features/carrinho/linhas'
import { useCarrinho } from '@/features/carrinho/use-carrinho'
import { formatarKz, formatarNumero } from '@/lib/format'
import { BotaoAdicionar } from './componentes/botao-adicionar'
import { BotaoFavorito } from './componentes/botao-favorito'
import { EstadoStock } from './componentes/estado-stock'
import { Preco } from './componentes/preco'
import { percentagemDesconto } from './desconto'
import { MediaProduto } from './media-produto'
import { Relacionados } from './relacionados'

export default function PaginaProduto() {
  const { slug = '' } = useParams()
  const { data: produto, isPending, isError } = useQuery(consultas.produto(slug))
  const { data: categorias } = useQuery(consultas.categorias())

  if (isPending) return <Esqueleto />
  if (isError || !produto)
    return (
      <div className="container-loja py-16">
        <title>Produto não encontrado — Fazenda</title>
        <EmptyState
          icon={PackageSearch}
          title="Produto não encontrado"
          description="Este produto pode ter sido retirado da loja ou o endereço está incorrecto."
          action={
            <Link to="/loja" className={buttonVariants()}>
              Voltar à loja
            </Link>
          }
        />
      </div>
    )

  const categoria = categorias?.find((c) => c.id === produto.categoria)

  return (
    <div className="container-loja py-6 sm:py-8">
      <title>{`${produto.nome} — Fazenda`}</title>
      <meta name="description" content={`${produto.nome}: ${produto.descricao}`} />

      <nav aria-label="Caminho" className="mb-6 text-sm text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <Link to="/" className="hover:text-floresta">
              Início
            </Link>
          </li>
          <ChevronRight className="size-3.5" aria-hidden="true" />
          <li>
            <Link to="/loja" className="hover:text-floresta">
              Loja
            </Link>
          </li>
          {categoria && (
            <>
              <ChevronRight className="size-3.5" aria-hidden="true" />
              <li>
                <Link to={`/loja?categoria=${categoria.id}`} className="hover:text-floresta">
                  {categoria.nome}
                </Link>
              </li>
            </>
          )}
          <ChevronRight className="size-3.5" aria-hidden="true" />
          <li aria-current="page" className="font-medium text-floresta">
            {produto.nome}
          </li>
        </ol>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
        <MediaProduto produto={produto} />
        <Detalhes key={produto.id} produto={produto} />
      </div>

      <Relacionados slug={produto.slug} />
      <BarraCompraTelemovel produto={produto} />
    </div>
  )
}

function Detalhes({ produto }: { produto: Produto }) {
  const [quantidade, setQuantidade] = useState(produto.minimo)
  const noCarrinho = useCarrinho((s) => s.linhas.find((l) => l.id === produto.id)?.quantidade ?? 0)
  const desconto = percentagemDesconto(produto.preco, produto.precoAnterior)
  const disponivel = Math.max(0, produto.stock - noCarrinho)
  const u = UNIDADES[produto.unidade].curta

  return (
    <div className="lg:pt-2">
      <div className="mb-3 flex flex-wrap gap-2">
        {desconto > 0 && <Badge variant="promocao">Promoção −{desconto}%</Badge>}
        <Badge variant="neutro">
          <CalendarDays /> {EPOCAS[produto.epoca]}
        </Badge>
      </div>
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-3xl font-bold sm:text-4xl">{produto.nome}</h1>
        <BotaoFavorito id={produto.id} nome={produto.nome} className="mt-1 shrink-0" />
      </div>
      <p className="mt-1 text-muted-foreground">{produto.descricaoCurta}</p>

      <Preco
        preco={produto.preco}
        precoAnterior={produto.precoAnterior}
        unidade={produto.unidade}
        tamanho="lg"
        className="mt-5"
      />
      <EstadoStock stock={produto.stock} className="mt-2" />

      {produto.stock > 0 && (
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <QuantityStepper
            value={Math.min(quantidade, Math.max(produto.minimo, disponivel))}
            onChange={setQuantidade}
            min={produto.minimo}
            max={Math.max(produto.minimo, disponivel)}
            step={produto.passo}
            unidade={u}
          />
          <BotaoAdicionar
            linha={linhaDeProduto(produto)}
            quantidade={quantidade}
            size="lg"
            mostrarIcone
            rotulo="Adicionar ao carrinho"
            className="flex-1 sm:flex-none"
            disabled={disponivel <= 0}
          />
        </div>
      )}
      {noCarrinho > 0 && (
        <p className="mt-3 text-sm text-muted-foreground">
          Já tem {formatarNumero(noCarrinho)} {u} no{' '}
          <Link
            to="/carrinho"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            carrinho
          </Link>
          .
        </p>
      )}

      <ul className="mt-8 divide-y divide-menta rounded-2xl border border-menta text-sm">
        <li className="flex items-start gap-3 p-4">
          <Truck className="mt-0.5 size-5 shrink-0 text-primary" />
          <span>
            <strong className="font-semibold text-floresta">Entrega em Luanda</strong> no dia
            seguinte. Grátis a partir de {formatarKz(ENTREGA_GRATIS_A_PARTIR)}.
          </span>
        </li>
        <li className="flex items-start gap-3 p-4">
          <MapPin className="mt-0.5 size-5 shrink-0 text-primary" />
          <span>
            <strong className="font-semibold text-floresta">Origem:</strong> {produto.origem}.
            Colhido na véspera da entrega.
          </span>
        </li>
      </ul>

      <section className="mt-8" aria-labelledby="titulo-descricao">
        <h2 id="titulo-descricao" className="text-lg font-semibold">
          Descrição
        </h2>
        <p className="mt-2 leading-relaxed text-muted-foreground">{produto.descricao}</p>
      </section>
    </div>
  )
}

/** No telemóvel, preço e botão de compra ficam sempre à mão no fundo do ecrã. */
function BarraCompraTelemovel({ produto }: { produto: Produto }) {
  if (produto.stock <= 0) return null
  return (
    <>
      <div className="h-20 lg:hidden" aria-hidden="true" />
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-menta bg-background/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-floresta">{produto.nome}</p>
            <Preco preco={produto.preco} unidade={produto.unidade} />
          </div>
          <BotaoAdicionar linha={linhaDeProduto(produto)} mostrarIcone />
        </div>
      </div>
    </>
  )
}

function Esqueleto() {
  return (
    <div className="container-loja py-8" aria-busy="true" aria-label="A carregar produto">
      <Skeleton className="mb-6 h-4 w-64" />
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
        <Skeleton className="aspect-square rounded-2xl" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-12 w-full max-w-sm" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    </div>
  )
}
