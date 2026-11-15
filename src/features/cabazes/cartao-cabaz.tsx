import { Check, Users } from 'lucide-react'
import type { Cabaz } from '@/api/tipos'
import { UNIDADES } from '@/api/tipos'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { linhaDeCabaz } from '@/features/carrinho/linhas'
import { BotaoAdicionar } from '@/features/produto/componentes/botao-adicionar'
import { Preco } from '@/features/produto/componentes/preco'
import { percentagemDesconto } from '@/features/produto/desconto'
import { formatarNumero } from '@/lib/format'
import { cn } from '@/lib/utils'

export function CartaoCabaz({ cabaz, className }: { cabaz: Cabaz; className?: string }) {
  const desconto = percentagemDesconto(cabaz.preco, cabaz.precoAnterior)
  return (
    <article
      id={cabaz.slug}
      className={cn(
        'flex scroll-mt-32 flex-col overflow-hidden rounded-2xl border border-menta bg-card',
        className,
      )}
    >
      <div className="relative aspect-[4/3] bg-nevoa">
        <img
          src={cabaz.imagem}
          alt={cabaz.nome}
          loading="lazy"
          className="size-full object-cover"
        />
        {desconto > 0 && (
          <Badge variant="promocao" className="absolute top-3 left-3">
            Poupa {desconto}%
          </Badge>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold">{cabaz.nome}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{cabaz.descricao}</p>
        <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-floresta">
          <Users className="size-3.5 text-primary" /> {cabaz.serve}
        </p>
        <ul className="mt-4 flex-1 space-y-1.5 text-sm">
          {cabaz.itens.map((i) => (
            <li key={i.produtoId} className="flex items-start gap-2">
              <Check className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>
                {i.nome}{' '}
                <span className="text-muted-foreground">
                  · {formatarNumero(i.quantidade)} {UNIDADES[i.unidade].curta}
                </span>
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-5 flex items-end justify-between gap-3 border-t border-menta pt-4">
          <Preco preco={cabaz.preco} precoAnterior={cabaz.precoAnterior} />
          <BotaoAdicionar linha={linhaDeCabaz(cabaz)} mostrarIcone />
        </div>
      </div>
    </article>
  )
}

export function CartaoCabazEsqueleto() {
  return (
    <div className="overflow-hidden rounded-2xl border border-menta">
      <Skeleton className="aspect-[4/3] rounded-none" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  )
}
