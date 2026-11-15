import { Box } from 'lucide-react'
import { Link } from 'react-router'
import type { Produto } from '@/api/tipos'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { linhaDeProduto } from '@/features/carrinho/linhas'
import { cn } from '@/lib/utils'
import { BotaoAdicionar } from './botao-adicionar'
import { BotaoFavorito } from './botao-favorito'
import { POUCO_STOCK } from './estado-stock'
import { percentagemDesconto } from '../desconto'
import { Preco } from './preco'

/**
 * Cartão de produto da grelha. Na grelha usamos sempre imagens (nunca 3D),
 * para o navegador não bloquear com muitos modelos na mesma página.
 */
export function CartaoProduto({ produto, className }: { produto: Produto; className?: string }) {
  const desconto = percentagemDesconto(produto.preco, produto.precoAnterior)
  const esgotado = produto.stock <= 0
  return (
    <article
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-2xl border border-menta bg-card transition-shadow hover:shadow-lg hover:shadow-floresta/5',
        className,
      )}
    >
      <div className="relative aspect-square overflow-hidden bg-nevoa">
        <img
          src={produto.imagens[0]}
          alt={produto.nome}
          loading="lazy"
          decoding="async"
          width={400}
          height={400}
          className={cn(
            'size-full object-cover transition-transform duration-500 group-hover:scale-105',
            esgotado && 'opacity-60 grayscale-[40%]',
          )}
        />
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {produto.modelo3d && (
            <Badge variant="contorno">
              <Box /> 3D
            </Badge>
          )}
          {desconto > 0 && <Badge variant="promocao">Promoção −{desconto}%</Badge>}
          {esgotado ? (
            <Badge variant="alerta">Esgotado</Badge>
          ) : (
            produto.stock <= POUCO_STOCK && <Badge variant="neutro">Últimas unidades</Badge>
          )}
        </div>
        <BotaoFavorito
          id={produto.id}
          nome={produto.nome}
          className="absolute top-3 right-3 z-10"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex-1">
          <h3 className="text-sm font-semibold sm:text-base">
            <Link
              to={`/produto/${produto.slug}`}
              className="after:absolute after:inset-0 focus-visible:outline-none"
            >
              {produto.nome}
            </Link>
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{produto.descricaoCurta}</p>
        </div>
        <div className="flex flex-wrap items-end justify-between gap-2">
          <Preco preco={produto.preco} precoAnterior={produto.precoAnterior} />
          <BotaoAdicionar linha={linhaDeProduto(produto)} size="sm" className="relative z-10" />
        </div>
      </div>
    </article>
  )
}

export function CartaoProdutoEsqueleto() {
  return (
    <div className="overflow-hidden rounded-2xl border border-menta">
      <Skeleton className="aspect-square rounded-none" />
      <div className="space-y-2 p-4">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/3" />
        <div className="flex justify-between pt-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    </div>
  )
}
